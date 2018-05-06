import {Component, Input, OnInit} from '@angular/core';
import {Square} from '../models/square.model';
import {Coordinates} from '../models/coordinates.model';
import {PieceImageData, PieceData, Colors, relativePath} from '../app-data';
import {
  getMovesForBishop,
  getMovesForKing,
  getMovesForKnight,
  getMovesForPawn,
  getMovesForQueen,
  getMovesForRook
} from '../helpers/move.helper';
import {SocketService} from '../move-comms.service';


@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.css']
})
export class ChessBoardComponent implements OnInit {

  @Input() id: number;
  objectKeys = Object.keys;

  // used to allow looping through the boardState object
  squareKeys: string[] = [];

  boardState = {};
  squareColorTracker: string;
  turn = Colors.WHITE;
  squareSelected: Square;
  legalMoves = [];
  placeHolderSquare: Square = new Square(null, null, null, null,
    false, null, null, false, false);
  hasMovedTracker: boolean;
  gameState;


  constructor(private socket: SocketService) {
    this.setUpBoardAsWhite();
  }

  ngOnInit() {
    this.socket.messages.subscribe(msg => {
      console.log(msg.type);
    });
  }

  setUpBoardAsWhite() {
    let counter = 1;
    this.squareColorTracker = Colors.BLACK;
    for (let y = 8; y > 0; y--) {
      this.squareColorTracker === Colors.BLACK ? this.squareColorTracker = Colors.WHITE : this.squareColorTracker = Colors.BLACK;
      for (let x = 1; x < 9; x++) {
        const coordinates = new Coordinates(x, y);
        (this.assignSquare(counter, coordinates, this.squareColorTracker));
        counter++;
        this.squareColorTracker === Colors.BLACK ? this.squareColorTracker = Colors.WHITE : this.squareColorTracker = Colors.BLACK;
      }
    }
  }

  assignSquare(counter, coordinates, squareColor) {
    const coordinateString = coordinates.x + ' ' + coordinates.y;

    this.squareKeys.push(coordinateString);

    if (counter === 1 || counter === 8) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.BLACK_ROOK,
        true, Colors.BLACK, PieceData.ROOK, false, false);
    } else if (counter === 2 || counter === 7) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.BLACK_KNIGHT,
        true, Colors.BLACK, PieceData.KNIGHT, false, false);
    } else if (counter === 3 || counter === 6) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.BLACK_BISHOP,
        true, Colors.BLACK, PieceData.BISHOP, false, false);
    } else if (counter === 4) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.BLACK_QUEEN,
        true, Colors.BLACK, PieceData.QUEEN, false, false);
    } else if (counter === 5) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.BLACK_KING,
        true, Colors.BLACK, PieceData.KING, false, false);
    } else if (counter > 8 && counter < 17) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.BLACK_PAWN,
        true, Colors.BLACK, PieceData.PAWN, false, false);
    } else if (counter > 48 && counter < 57) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.WHITE_PAWN,
        true, Colors.WHITE, PieceData.PAWN, false, false);
    } else if (counter === 57 || counter === 64) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.WHITE_ROOK,
        true, Colors.WHITE, PieceData.ROOK, false, false);
    } else if (counter === 58 || counter === 63) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.WHITE_KNIGHT,
        true, Colors.WHITE, PieceData.KNIGHT, false, false);
    } else if (counter === 59 || counter === 62) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.WHITE_BISHOP,
        true, Colors.WHITE, PieceData.BISHOP, false, false);
    } else if (counter === 60) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.WHITE_QUEEN,
        true, Colors.WHITE, PieceData.QUEEN, false, false);
    } else if (counter === 61) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.WHITE_KING,
        true, Colors.WHITE, PieceData.KING, false, false);
    } else {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, null,
        false, null, null, false, false);
    }
  }

  onSquareClicked(square: Square) {
    console.log(square);
    if (this.squareSelected) {
      this.squareSelected.squareColor = this.squareSelected.squareColorSaver;
    }


    if (square.isEligibleToMoveTo) {
      if (this.moveWillSelfCheck(this.squareSelected, square)) {
        return;
      }
      this.movePiece(this.squareSelected, square);
      this.isCheck();
      this.socket.sendMsg({
        type: 'move',
        payload: {
          id: 1,
          mover: this.squareSelected.coordinate.x + ' ' + this.squareSelected.coordinate.y,
          destination: square.coordinate.x + ' ' + square.coordinate.y
        }
      });
      this.endTurn();
    }
    this.resetPossibleMoves();
    this.squareSelected = square;

    if (this.squareSelected.isOccupied && this.squareSelected.pieceColor === this.turn) {

      this.legalMoves = [];
      this.squareSelected.squareColor = Colors.SELECTED;
      this.legalMoves = this.findPossibleMoves(this.squareSelected);
      this.assignSquaresAsEligibleForMove();
    }
  }

  private moveWillSelfCheck(squareSelected: Square, square: Square) {
    let isCheck = false;

    this.movePieceLogically(squareSelected, square);

    this.squareKeys.forEach(squareKey => {
      if (this.boardState[squareKey].isOccupied && this.boardState[squareKey].pieceColor !== this.turn) {
        const moves = this.findPossibleMoves(this.boardState[squareKey]);
        moves.forEach(move => {
          if (this.boardState[move].pieceType === PieceData.KING) {
            isCheck = true;
          }
        });
      }
    });
    this.undoMovePieceLogically(squareSelected, square);
    return isCheck;

  }

  findPossibleMoves(square) {
    switch (square.pieceType) {
      case PieceData.PAWN:
        return getMovesForPawn(square, this.boardState);
      case PieceData.KNIGHT:
        return getMovesForKnight(square, this.boardState);
      case PieceData.BISHOP:
        return getMovesForBishop(square, this.boardState);
      case PieceData.ROOK:
        return getMovesForRook(square, this.boardState);
      case PieceData.QUEEN:
        return getMovesForQueen(square, this.boardState);
      case PieceData.KING:
        return getMovesForKing(square, this.boardState);
    }
  }

  assignSquaresAsEligibleForMove() {
    this.legalMoves.forEach(move => {
      this.boardState[move].isEligibleToMoveTo = true;
    });
  }

  movePiece(mover: Square, destination: Square) {
    this.movePieceLogically(mover, destination);
    this.movePieceVisually(mover, destination);
  }

  private movePieceVisually(mover: Square, destination: Square) {
    destination.imagePath = mover.imagePath;
    mover.imagePath = null;
  }

  private movePieceLogically(mover: Square, destination: Square) {
    this.hasMovedTracker = mover.pieceHasMoved;

    this.placeHolderSquare.pieceColor = destination.pieceColor;
    this.placeHolderSquare.pieceType = destination.pieceType;
    this.placeHolderSquare.pieceHasMoved = destination.pieceHasMoved;
    this.placeHolderSquare.isOccupied = destination.isOccupied;

    destination.pieceColor = mover.pieceColor;
    destination.pieceType = mover.pieceType;
    destination.isOccupied = true;
    destination.pieceHasMoved = true;

    console.log(mover.pieceColor);

    mover.pieceType = PieceData.EMPTY;
    mover.isOccupied = false;
    mover.pieceColor = null;
  }

  private undoMovePieceLogically(mover: Square, destination: Square) {
    mover.pieceType = destination.pieceType;
    mover.isOccupied = true;
    mover.pieceColor = destination.pieceColor;
    mover.pieceHasMoved = this.hasMovedTracker;

    destination.pieceColor = this.placeHolderSquare.pieceColor;
    destination.pieceType = this.placeHolderSquare.pieceType;
    destination.pieceHasMoved = this.placeHolderSquare.pieceHasMoved;
    destination.isOccupied = this.placeHolderSquare.isOccupied;
  }

  resetPossibleMoves() {
    this.legalMoves.forEach(move => {
      this.boardState[move].isEligibleToMoveTo = false;
    });
  }

  endTurn() {
    if (this.turn === Colors.WHITE) {
      this.turn = Colors.BLACK;
    } else {
      this.turn = Colors.WHITE;
    }
  }

  isCheck() {
    let isCheck = false;
    this.squareKeys.forEach(square => {
      if (this.boardState[square].isOccupied && this.boardState[square].pieceColor === this.turn) {
        const moves = this.findPossibleMoves(this.boardState[square]);
        moves.forEach(move => {
          if (this.boardState[move].pieceType === PieceData.KING) {
            isCheck = true;
          }
        });
      }
    });
    console.log(isCheck);
    return isCheck;
  }
}


