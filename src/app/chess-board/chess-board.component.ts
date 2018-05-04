import {Component, OnInit} from '@angular/core';
import {Square} from '../models/square.model';
import {Coordinates} from '../models/coordinates.model';
import {PieceImageData, PieceData, Colors, relativePath} from '../app-data';
import {getMovesForBishop, getMovesForKing, getMovesForKnight, getMovesForQueen, getMovesForRook} from '../services/move.services';


@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.css']
})
export class ChessBoardComponent implements OnInit {

  objectKeys = Object.keys;
  squares: Square[] = [];
  occupiedSquares: string[] = [];
  boardState = {};
  squareColorTracker: string;
  turn = Colors.WHITE;
  squareSelected;
  legalMoves = [];
  gameState;


  assignSquare(counter, coordinates, squareColor) {
    const coordinateString = coordinates.x + ' ' + coordinates.y;
    if ((counter > 0 && counter < 17) || counter > 48) {
      this.occupiedSquares.push(coordinateString);
    }
    if (counter === 1 || counter === 8) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.BLACK_ROOK,
        true, Colors.BLACK, PieceData.ROOK, false);
    } else if (counter === 2 || counter === 7) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.BLACK_KNIGHT,
        true, Colors.BLACK, PieceData.KNIGHT, false);
    } else if (counter === 3 || counter === 6) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.BLACK_BISHOP,
        true, Colors.BLACK, PieceData.BISHOP, false);
    } else if (counter === 4) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.BLACK_QUEEN,
        true, Colors.BLACK, PieceData.QUEEN, false);
    } else if (counter === 5) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.BLACK_KING,
        true, Colors.BLACK, PieceData.KING, false);
    } else if (counter > 8 && counter < 17) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.BLACK_PAWN,
        true, Colors.BLACK, PieceData.PAWN, false);
    } else if (counter > 48 && counter < 57) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.WHITE_PAWN,
        true, Colors.WHITE, PieceData.PAWN, false);
    } else if (counter === 57 || counter === 64) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.WHITE_ROOK,
        true, Colors.WHITE, PieceData.ROOK, false);
    } else if (counter === 58 || counter === 63) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.WHITE_KNIGHT,
        true, Colors.WHITE, PieceData.KNIGHT, false);
    } else if (counter === 59 || counter === 62) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.WHITE_BISHOP,
        true, Colors.WHITE, PieceData.BISHOP, false);
    } else if (counter === 60) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.WHITE_QUEEN,
        true, Colors.WHITE, PieceData.QUEEN, false);
    } else if (counter === 61) {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, relativePath + PieceImageData.WHITE_KING,
        true, Colors.WHITE, PieceData.KING, false);
    } else {
      this.boardState[coordinateString] = new Square(coordinates, squareColor, squareColor, null,
        false, null, null, false);
    }
  }

  constructor() {
    this.setUpBoardAsWhite();
    console.log(this.occupiedSquares);
  }

  ngOnInit() {

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


  onSquareClicked(square) {
    if (this.squareSelected) {
      this.squareSelected.squareColor = this.squareSelected.squareColorSaver;
    }

    this.squareSelected = square;


    if (this.squareSelected.isOccupied && this.squareSelected.pieceColor === this.turn) {
      this.squareSelected.squareColor = Colors.SELECTED;
      this.findPossibleMoves(this.squareSelected);
    }
  }

  findPossibleMoves(square) {
    this.legalMoves = [];
    switch (square.pieceType) {
      case PieceData.PAWN:
        this.legalMoves = [];
        break;
      case PieceData.KNIGHT:
        this.legalMoves = getMovesForKnight(square, this.boardState);
        break;
      case PieceData.BISHOP:
        this.legalMoves = getMovesForBishop(square, this.boardState);
        break;
      case PieceData.ROOK:
        this.legalMoves = getMovesForRook(square, this.boardState);
        break;
      case PieceData.QUEEN:
        this.legalMoves = getMovesForQueen(square, this.boardState);
        break;
      case PieceData.KING:
        this.legalMoves = getMovesForKing(square, this.boardState);
    }
    console.log(this.legalMoves);
  }
}
