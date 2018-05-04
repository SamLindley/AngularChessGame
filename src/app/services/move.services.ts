import {Coordinates} from '../models/coordinates.model';
import {Colors} from '../app-data';

function getTheoreticalMovesNorthEast(coordinates: Coordinates): Coordinates[] {
  const moves: Coordinates[] = [];
  for (let x = 1; x < 8; x++) {
    moves.push(new Coordinates(coordinates.x + x, coordinates.y - x));
  }
  return moves;
}

function getTheoreticalMovesNorthWest(coordinates: Coordinates): Coordinates[] {
  const moves: Coordinates[] = [];
  for (let x = 1; x < 8; x++) {
    moves.push(new Coordinates(coordinates.x - x, coordinates.y - x));
  }
  return moves;
}

function getTheoreticalMovesSouthEast(coordinates: Coordinates): Coordinates[] {
  const moves: Coordinates[] = [];
  for (let x = 1; x < 8; x++) {
    moves.push(new Coordinates(coordinates.x + x, coordinates.y + x));
  }
  return moves;
}

function getTheoreticalMovesSouthWest(coordinates: Coordinates): Coordinates[] {
  const moves: Coordinates[] = [];
  for (let x = 1; x < 8; x++) {
    moves.push(new Coordinates(coordinates.x - x, coordinates.y + x));
  }
  return moves;
}

function getTheoreticalMovesEast(coordinates: Coordinates): Coordinates[] {
  const moves: Coordinates[] = [];
  for (let x = 1; x < 8; x++) {
    moves.push(new Coordinates(coordinates.x + x, coordinates.y));
  }
  return moves;
}

function getTheoreticalMovesWest(coordinates: Coordinates): Coordinates[] {
  const moves: Coordinates[] = [];
  for (let x = 1; x < 8; x++) {
    moves.push(new Coordinates(coordinates.x - x, coordinates.y));
  }
  return moves;
}

function getTheoreticalMovesNorth(coordinates: Coordinates): Coordinates[] {
  const moves: Coordinates[] = [];
  for (let x = 1; x < 8; x++) {
    moves.push(new Coordinates(coordinates.x, coordinates.y + x));
  }
  return moves;
}

function getTheoreticalMovesSouth(coordinates: Coordinates): Coordinates[] {
  const moves: Coordinates[] = [];
  for (let x = 1; x < 8; x++) {
    moves.push(new Coordinates(coordinates.x, coordinates.y - x));
  }
  return moves;
}

function getTheoreticalKingMoves(coordinates: Coordinates): Coordinates[] {
  const moves: Coordinates[] = [];
  const x = coordinates.x;
  const y = coordinates.y;
  moves.push(new Coordinates(x - 1, y + 1));
  moves.push(new Coordinates(x, y + 1));
  moves.push(new Coordinates(x + 1, y + 1));
  moves.push(new Coordinates(x - 1, y));
  moves.push(new Coordinates(x + 1, y));
  moves.push(new Coordinates(x - 1, y - 1));
  moves.push(new Coordinates(x, y - 1));
  moves.push(new Coordinates(x + 1, y - 1));
  return moves;
}

function getTheoreticalKnightMoves(coordinates: Coordinates): Coordinates[] {
  const moves: Coordinates[] = [];
  const x = coordinates.x;
  const y = coordinates.y;
  moves.push(new Coordinates(x - 2, y + 1));
  moves.push(new Coordinates(x + 2, y + 1));
  moves.push(new Coordinates(x - 2, y - 1));
  moves.push(new Coordinates(x + 2, y - 1));
  moves.push(new Coordinates(x - 1, y + 2));
  moves.push(new Coordinates(x - 1, y - 2));
  moves.push(new Coordinates(x + 1, y + 2));
  moves.push(new Coordinates(x + 1, y - 2));
  return moves;
}

function getTheoreticalPawnMoves(coordinates: Coordinates, hasMoved: boolean, color: string): Coordinates[] {
  const moves: Coordinates[] = [];
  const x = coordinates.x;
  const y = coordinates.y;
  if (color === Colors.WHITE) {
    moves.push(new Coordinates(x, y + 1));
    moves.push(new Coordinates(x - 1, y + 1));
    moves.push(new Coordinates(x + 1, y + 1));
    if (!hasMoved) {
      moves.push(new Coordinates(x, y + 2));
    }
  } else {
    moves.push(new Coordinates(x, y - 1));
    moves.push(new Coordinates(x - 1, y - 1));
    moves.push(new Coordinates(x + 1, y - 1));
    if (!hasMoved) {
      moves.push(new Coordinates(x, y - 2));
    }
  }
  return moves;
}
