import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
import {SocketService} from '../services/move-comms.service';
import {SocketMessage} from '../models/socket-message.model';


@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.css']
})
export class ChessBoardComponent implements OnInit {

  @Output() gameEnded = new EventEmitter();
  @Input() id: number;
  @Input() clientColor;
  WHITE_KINGSIDE_CASTLE_SPACES = ['6 1', '7 1'];
  WHITE_QUEENSIDE_CASTLE_SPACES = ['2 1', '3 1', '4 1'];
  BLACK_KINGSIDE_CASTLE_SPACES = ['6 8', '7 8'];
  BLACK_QUEENSIDE_CASTLE_SPACES = ['2 8', '3 8', '4 8'];

  isClientTurn;
  objectKeys = Object.keys;
  kingIsInCheck = false;

  // used to allow looping through the boardState object
  squareKeys: string[] = [];

  boardState = {};
  squareColorTracker: string;
  kingCastlePossible = false;
  queenCastlePossible = false;
  kRookMoved = false;
  qRookMoved = false;

  kingMoved = false;


  turn = Colors.WHITE;
  squareSelected: Square = null;
  legalMoves = [];
  placeHolderSquare: Square = new Square(null, null, null, null,
    false, null, null, false, false, false);
  hasMovedTracker: boolean;

  constructor(private socket: SocketService) {
  }

  ngOnInit() {
    this.socket.messages.subscribe(msg => {
      if (msg.type === 'move') {

        const mover = this.boardState[msg.data.payload.mover];
        const destination = this.boardState[msg.data.payload.destination];
        this.moveOppositionPiece(mover, destination);
        this.endTurn();
        this.isClientTurn = true;
        if (msg.data.payload.isCheckmate === true) {
          this.kingIsInCheck = true;
          this.endGame(false);
        }
      }
    });
    this.clientColor === 'white' ? this.setUpBoardAsWhite() : this.setUpBoardAsBlack();
  }

  endGame(winner: boolean) {
    this.clientColor = null;
    this.gameEnded.emit(winner);
  }

  setUpBoardAsWhite() {
    let counter = 1;
    this.isClientTurn = true;
    this.squareColorTracker = Colors.GREY;
    for (let y = 8; y > 0; y--) {
      this.squareColorTracker === Colors.GREY ? this.squareColorTracker = Colors.WHITE : this.squareColorTracker = Colors.GREY;
      for (let x = 1; x < 9; x++) {
        const coordinates = new Coordinates(x, y);
        (this.assignSquare(counter, coordinates, this.squareColorTracker));
        counter++;
        this.squareColorTracker === Colors.GREY ? this.squareColorTracker = Colors.WHITE : this.squareColorTracker = Colors.GREY;
      }
    }
    this.isClientTurn = true;
  }

  setUpBoardAsBlack() {
    let counter = 64;
    this.isClientTurn = false;

    this.squareColorTracker = Colors.GREY;
    for (let y = 1; y < 9; y++) {
      this.squareColorTracker === Colors.GREY ? this.squareColorTracker = Colors.WHITE : this.squareColorTracker = Colors.GREY;
      for (let x = 8; x > 0; x--) {
        const coordinates = new Coordinates(x, y);
        (this.assignSquare(counter, coordinates, this.squareColorTracker));
        counter--;
        this.squareColorTracker === Colors.GREY ? this.squareColorTracker = Colors.WHITE : this.squareColorTracker = Colors.GREY;
      }
    }
  }

  assignSquare(counter, coordinates, squareColor) {
    const coordinateString = coordinates.x + ' ' + coordinates.y;

    this.squareKeys.push(coordinateString);

    if (counter === 1 || counter === 8) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.BLACK_ROOK,
        true, Colors.BLACK, PieceData.ROOK, false, false, false);
    } else if (counter === 2 || counter === 7) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.BLACK_KNIGHT,
        true, Colors.BLACK, PieceData.KNIGHT, false, false, false);
    } else if (counter === 3 || counter === 6) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.BLACK_BISHOP,
        true, Colors.BLACK, PieceData.BISHOP, false, false, false);
    } else if (counter === 4) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.BLACK_QUEEN,
        true, Colors.BLACK, PieceData.QUEEN, false, false, false);
    } else if (counter === 5) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.BLACK_KING,
        true, Colors.BLACK, PieceData.KING, false, false, false);
    } else if (counter > 8 && counter < 17) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.BLACK_PAWN,
        true, Colors.BLACK, PieceData.PAWN, false, false, false);
    } else if (counter > 48 && counter < 57) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.WHITE_PAWN,
        true, Colors.WHITE, PieceData.PAWN, false, false, false);
    } else if (counter === 57 || counter === 64) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.WHITE_ROOK,
        true, Colors.WHITE, PieceData.ROOK, false, false, false);
    } else if (counter === 58 || counter === 63) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.WHITE_KNIGHT,
        true, Colors.WHITE, PieceData.KNIGHT, false, false, false);
    } else if (counter === 59 || counter === 62) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.WHITE_BISHOP,
        true, Colors.WHITE, PieceData.BISHOP, false, false, false);
    } else if (counter === 60) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.WHITE_QUEEN,
        true, Colors.WHITE, PieceData.QUEEN, false, false, false);
    } else if (counter === 61) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.WHITE_KING,
        true, Colors.WHITE, PieceData.KING, false, false, false);
    } else {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, null,
        false, null, null, false, false, false);
    }
  }

  onSquareClicked(square: Square) {
    if (this.isClientTurn) {
      if (this.squareSelected) {
        this.squareSelected.squareColor = this.squareSelected.squareColorSaver;
      }


      if (square.isEligibleToMoveTo) {
        if (this.moveWillSelfCheck(this.squareSelected, square)) {
          return;
        }

        if (this.squareSelected.pieceType === PieceData.KING) {
          this.kingMoved = true;
        }
        if (this.squareSelected.pieceType === PieceData.ROOK) {
          if (this.squareSelected.coordinate.x === 1) {
            this.qRookMoved = true;
          } else {
            this.kRookMoved = true;
          }
        }

        if (square.isCastlingIfMovedTo) {
          if (square.coordinate.y === 1 && square.coordinate.x === 3) {
            this.movePiece(this.boardState['1 1'], this.boardState['4 1']);
            this.sendCastleInfo('1 1', '4 1');
          } else if (square.coordinate.y === 1 && square.coordinate.x === 7) {
            this.movePiece(this.boardState['8 1'], this.boardState['6 1']);
            this.sendCastleInfo('8 1', '6 1');

          } else if (square.coordinate.y === 8 && square.coordinate.x === 3) {
            this.movePiece(this.boardState['1 8'], this.boardState['4 8']);
            this.sendCastleInfo('1 8', '4 8');

          } else {
            this.movePiece(this.boardState['8 8'], this.boardState['6 8']);
            this.sendCastleInfo('8 8', '6 8');

          }
        }

        this.movePiece(this.squareSelected, square);
        this.kingIsInCheck = false;

        let isCheckmate = false;

        if (this.isCheck()) {
          if (this.checkForCheckmate()) {
            isCheckmate = true;
            this.endGame(true);
          }
        }

        this.socket.sendMsg(new SocketMessage(
          'move',
          {
            id: this.id,
            mover: this.squareSelected.coordinate.x + ' ' + this.squareSelected.coordinate.y,
            destination: square.coordinate.x + ' ' + square.coordinate.y,
            isCheckmate: isCheckmate
          }));

        this.endTurn();
      }
      this.resetPossibleMoves();
      this.squareSelected = square;

      if (this.squareSelected.isOccupied && this.isClientTurn && this.squareSelected.pieceColor === this.clientColor) {

        this.boardState['3 1'].isCastlingIfMovedTo = false;
        this.boardState['3 8'].isCastlingIfMovedTo = false;
        this.boardState['7 1'].isCastlingIfMovedTo = false;
        this.boardState['7 8'].isCastlingIfMovedTo = false;

        this.legalMoves = [];
        this.squareSelected.squareColor = Colors.SELECTED;
        this.legalMoves = this.findPossibleMoves(this.squareSelected);
        if (square.pieceType === PieceData.KING) {
          this.castlingCheck();
          if (this.queenCastlePossible) {
            if (this.clientColor === 'white') {
              this.legalMoves.push('3 1');
              this.boardState['3 1'].isCastlingIfMovedTo = true;
            } else {
              this.legalMoves.push('3 8');
              this.boardState['3 8'].isCastlingIfMovedTo = true;
            }
          }
          if (this.kingCastlePossible) {
            if (this.clientColor === 'white') {
              this.legalMoves.push('7 1');
              this.boardState['7 1'].isCastlingIfMovedTo = true;
            } else {
              this.legalMoves.push('7 8');
              this.boardState['7 8'].isCastlingIfMovedTo = true;
            }
          }
        }


        this.assignSquaresAsEligibleForMove();
        console.log(this.legalMoves);
      }
    }
  }

  sendCastleInfo(mover, destination) {
    this.socket.sendMsg(new SocketMessage(
      'move',
      {
        id: this.id,
        mover: mover,
        destination: destination,
        isCheckmate: false
      }));
  }

  castlingCheck() {
    let kingsideWayIsClear = true;
    let queensideWayIsClear = true;
    if (this.clientColor === 'white') {
      this.WHITE_KINGSIDE_CASTLE_SPACES.forEach(coords => {
        if (this.boardState[coords].isOccupied) {
          kingsideWayIsClear = false;
        }
      });
      this.WHITE_QUEENSIDE_CASTLE_SPACES.forEach(coords => {
        if (this.boardState[coords].isOccupied) {
          console.log(coords);
          queensideWayIsClear = false;
        }
      });
    } else {
      this.BLACK_KINGSIDE_CASTLE_SPACES.forEach(coords => {
        if (this.boardState[coords].isOccupied) {
          kingsideWayIsClear = false;
        }
      });
      this.BLACK_QUEENSIDE_CASTLE_SPACES.forEach(coords => {
        if (this.boardState[coords].isOccupied) {
          console.log(coords);
          queensideWayIsClear = false;
        }
      });
    }
    if (!this.kingIsInCheck && !this.kingMoved && !this.kRookMoved && kingsideWayIsClear) {
      this.kingCastlePossible = true;
    }
    if (!this.kingIsInCheck && !this.kingMoved && !this.qRookMoved && queensideWayIsClear) {
      this.queenCastlePossible = true;
    }
    console.log(this.qRookMoved, this.kingMoved, queensideWayIsClear);
    console.log(this.queenCastlePossible);
  }

  checkForCheckmate() {
    let isCheckmate = true;
    const resultsOfMoves = [];
    this.squareKeys.forEach(squareKey => {

      if (this.boardState[squareKey].pieceColor !== this.clientColor && this.boardState[squareKey].isOccupied) {
        const moves = this.findPossibleMoves(this.boardState[squareKey]);
        moves.forEach(move => {
          let moveWillStopCheck = true;
          this.movePieceLogically(this.boardState[squareKey], this.boardState[move]);
          this.squareKeys.forEach(key => {
            if (this.boardState[key].pieceColor === this.clientColor) {
              const theoreticalMoves = this.findPossibleMoves(this.boardState[key]);
              theoreticalMoves.forEach(tMove => {
                if (this.boardState[tMove].pieceType === PieceData.KING) {
                  console.log(tMove);
                  moveWillStopCheck = false;
                }
              });
            }
          });
          resultsOfMoves.push(moveWillStopCheck);
          this.undoMovePieceLogically(this.boardState[squareKey], this.boardState[move]);
        });
      }
    });
    resultsOfMoves.forEach(result => {
      if (result) {
        isCheckmate = false;
      }
    });
    return isCheckmate;

  }

  private moveWillSelfCheck(squareSelected: Square, square: Square) {
    let isCheck = false;

    this.movePieceLogically(squareSelected, square);

    this.squareKeys.forEach(squareKey => {
      if (this.boardState[squareKey].isOccupied && this.boardState[squareKey].pieceColor !== this.clientColor) {
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

  moveOppositionPiece(mover: Square, destination: Square) {
    this.movePieceLogically(mover, destination);
    this.movePieceVisually(mover, destination);
  }

  private movePieceVisually(mover: Square, destination: Square) {
    destination.imagePath = mover.imagePath;
    mover.imagePath = null;
  }

  private movePieceLogically(mover: Square, destination: Square) {
    this.hasMovedTracker = mover.pieceHasMoved;
    if (mover.pieceType === PieceData.KING && mover.pieceType) {

    }

    this.placeHolderSquare.pieceColor = destination.pieceColor;
    this.placeHolderSquare.pieceType = destination.pieceType;
    this.placeHolderSquare.pieceHasMoved = destination.pieceHasMoved;
    this.placeHolderSquare.isOccupied = destination.isOccupied;

    destination.pieceColor = mover.pieceColor;
    destination.pieceType = mover.pieceType;
    destination.isOccupied = true;
    destination.pieceHasMoved = true;

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
    this.isClientTurn = false;
  }

  isCheck() {
    let isCheck = false;
    this.squareKeys.forEach(square => {
      if (this.boardState[square].isOccupied && this.boardState[square].pieceColor === this.clientColor) {
        const moves = this.findPossibleMoves(this.boardState[square]);
        moves.forEach(move => {
          if (this.boardState[move].pieceType === PieceData.KING) {
            isCheck = true;
          }
        });
      }
    });
    return isCheck;
  }
}


