import {Coordinates} from './coordinates.model';

export class Square {
  constructor(
    public coordinate: Coordinates,
    public squareColor: string,
    public squareColorSaver: string,
    public imagePath: string,
    public isOccupied: boolean,
    public pieceColor: string,
    public pieceType: number,
    public pieceHasMoved: boolean,
    public isEligibleToMoveTo: boolean,
    public isCastlingIfMovedTo: boolean
  ) {}
}
