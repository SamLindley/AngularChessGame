import {Coordinates} from './coordinates.model';

export class Square {
  constructor(
    public coordinate: Coordinates,
    public squareColor: string,
    public imagePath: string,
    public isOccupied: boolean,
    public pieceColor: string,
    public pieceType: number,
    public elligibleToMoveTo: boolean
  ) {}
}
