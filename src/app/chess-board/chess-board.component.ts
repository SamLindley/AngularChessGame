import {Component, OnInit} from '@angular/core';
import {Square} from '../models/square.model';
import {Coordinates} from '../models/coordinates.model';
import {PieceImageData, PieceData, Colors, relativePath} from '../app-data';


@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.css']
})
export class ChessBoardComponent implements OnInit {

  squares: Square[] = [];
  boardState = {};
  squareColorTracker: string;

  static assignSquare(counter, coordinates, squareColor) {
    if (counter === 1 || counter === 8) {
      return new Square(coordinates, squareColor, relativePath + PieceImageData.BLACK_ROOK,
        true, Colors.BLACK, PieceData.ROOK, false);
    } else if (counter === 2 || counter === 7) {
      return new Square(coordinates, squareColor, relativePath + PieceImageData.BLACK_KNIGHT,
        true, Colors.BLACK, PieceData.KNIGHT, false);
    } else if (counter === 3 || counter === 6) {
      return new Square(coordinates, squareColor, relativePath + PieceImageData.BLACK_BISHOP,
        true, Colors.BLACK, PieceData.BISHOP, false);
    } else if (counter === 4) {
      return new Square(coordinates, squareColor, relativePath + PieceImageData.BLACK_QUEEN,
        true, Colors.BLACK, PieceData.QUEEN, false);
    } else if (counter === 5) {
      return new Square(coordinates, squareColor, relativePath + PieceImageData.BLACK_KING,
        true, Colors.BLACK, PieceData.KING, false);
    } else if (counter > 8 && counter < 17) {
      return new Square(coordinates, squareColor, relativePath + PieceImageData.BLACK_PAWN,
        true, Colors.BLACK, PieceData.PAWN, false);
    } else if (counter > 48 && counter < 57) {
      return new Square(coordinates, squareColor, relativePath + PieceImageData.WHITE_PAWN,
        true, Colors.WHITE, PieceData.PAWN, false);
    } else if (counter === 57 || counter === 64) {
      return new Square(coordinates, squareColor, relativePath + PieceImageData.WHITE_ROOK,
        true, Colors.WHITE, PieceData.ROOK, false);
    } else if (counter === 58 || counter === 63) {
      return new Square(coordinates, squareColor, relativePath + PieceImageData.WHITE_KNIGHT,
        true, Colors.WHITE, PieceData.KNIGHT, false);
    } else if (counter === 59 || counter === 62) {
      return new Square(coordinates, squareColor, relativePath + PieceImageData.WHITE_BISHOP,
        true, Colors.WHITE, PieceData.BISHOP, false);
    } else if (counter === 60) {
      return new Square(coordinates, squareColor, relativePath + PieceImageData.WHITE_QUEEN,
        true, Colors.WHITE, PieceData.QUEEN, false);
    } else if (counter === 61) {
      return new Square(coordinates, squareColor, relativePath + PieceImageData.WHITE_KING,
        true, Colors.WHITE, PieceData.KING, false);
    } else {
      return new Square(coordinates, squareColor, null,
        false, null, null, false);
    }
  }

  constructor() {
    this.setUpBoardAsWhite();
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
        this.squares.push(ChessBoardComponent.assignSquare(counter, coordinates, this.squareColorTracker));
        counter++;
        this.squareColorTracker === Colors.BLACK ? this.squareColorTracker = Colors.WHITE : this.squareColorTracker = Colors.BLACK;
      }
    }
  }


}
