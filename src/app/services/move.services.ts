import {Coordinates} from '../models/coordinates.model';
import {Colors} from '../app-data';
import {Square} from '../models/square.model';

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

export function getTheoreticalPawnMoves(coordinates: Coordinates, hasMoved: boolean, color: string): Coordinates[] {
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

function isHostile(selectedSquare, destination) {
  return selectedSquare.pieceColor !== destination.pieceColor;
}

export function getMovesForKing(selectedSquare: Square, boardState) {
  const potentialMoves = getTheoreticalKingMoves(selectedSquare.coordinate);
  const legalMoves = [];
  potentialMoves.forEach(move => {
    const coordinateKey = move.x + ' ' + move.y;
    const square = boardState[coordinateKey];
    if (isWithinBounds(move) && !square.isOccupied) {
      legalMoves.push(coordinateKey);
    }
    if (isWithinBounds(move) && square.isOccupied && isHostile(selectedSquare, square)) {
      legalMoves.push(coordinateKey);
    }
  });
  return legalMoves;
}

export function getMovesForKnight(selectedSquare: Square, boardState) {
  const potentialMoves = getTheoreticalKnightMoves(selectedSquare.coordinate);
  const legalMoves = [];
  potentialMoves.forEach(move => {
    const coordinateKey = move.x + ' ' + move.y;
    const square = boardState[coordinateKey];
    if (isWithinBounds(move) && !square.isOccupied) {
      legalMoves.push(coordinateKey);
    }
    if (isWithinBounds(move) && square.isOccupied && isHostile(selectedSquare, square)) {
      legalMoves.push(coordinateKey);
    }
  });
  return legalMoves;
}

export function getMovesForQueen(selectedSquare: Square, boardState) {

  const diagonal = (getAllDiagonalMoves(selectedSquare, boardState));
  const hv = (getAllHorizontalAndVerticalMoves(selectedSquare, boardState));
  return [...diagonal, ...hv];
}

export function getMovesForBishop(selectedSquare: Square, boardState) {
  return getAllDiagonalMoves(selectedSquare, boardState);
}

export function getMovesForRook(selectedSquare: Square, boardState) {
  return getAllHorizontalAndVerticalMoves(selectedSquare, boardState);
}

function getAllHorizontalAndVerticalMoves(selectedSquare: Square, boardState) {
  const legalMoves = [];
  const potentialMovesEast = getTheoreticalMovesEast(selectedSquare.coordinate);
  const potentialMovesWest = getTheoreticalMovesWest(selectedSquare.coordinate);
  const potentialMovesNorth = getTheoreticalMovesNorth(selectedSquare.coordinate);
  const potentialMovesSouth = getTheoreticalMovesSouth(selectedSquare.coordinate);

  // TODO refactor method
  potentialMovesEast.some(move => {
    const coordinateKey = move.x + ' ' + move.y;
    if (isWithinBounds(move) && boardState[coordinateKey].isOccupied) {
      if (isHostile(selectedSquare, boardState[coordinateKey])) {
        legalMoves.push(coordinateKey);
      }
      return true;
    } else if (isWithinBounds(move)) {
      legalMoves.push(coordinateKey);
    }
  });

  potentialMovesWest.some(move => {
    const coordinateKey = move.x + ' ' + move.y;
    if (isWithinBounds(move) && boardState[coordinateKey].isOccupied) {
      if (isHostile(selectedSquare, boardState[coordinateKey])) {
        legalMoves.push(coordinateKey);
      }
      return true;
    } else if (isWithinBounds(move)) {
      legalMoves.push(coordinateKey);
    }
  });

  potentialMovesNorth.some(move => {
    const coordinateKey = move.x + ' ' + move.y;
    if (isWithinBounds(move) && boardState[coordinateKey].isOccupied) {
      if (isHostile(selectedSquare, boardState[coordinateKey])) {
        legalMoves.push(coordinateKey);
      }
      return true;
    } else if (isWithinBounds(move)) {
      legalMoves.push(coordinateKey);
    }
  });

  potentialMovesSouth.some(move => {
    const coordinateKey = move.x + ' ' + move.y;
    if (isWithinBounds(move) && boardState[coordinateKey].isOccupied) {
      if (isHostile(selectedSquare, boardState[coordinateKey])) {
        legalMoves.push(coordinateKey);
      }
      return true;
    } else if (isWithinBounds(move)) {
      legalMoves.push(coordinateKey);
    }
  });

  return legalMoves;
}

function getAllDiagonalMoves(selectedSquare: Square, boardState) {
  const legalMoves = [];
  const potentialMovesSouthEast = getTheoreticalMovesSouthEast(selectedSquare.coordinate);
  const potentialMovesSouthWest = getTheoreticalMovesSouthWest(selectedSquare.coordinate);
  const potentialMovesNorthEast = getTheoreticalMovesNorthEast(selectedSquare.coordinate);
  const potentialMovesNorthWest = getTheoreticalMovesNorthWest(selectedSquare.coordinate);

  // TODO refactor method
  potentialMovesSouthEast.some(move => {
    const coordinateKey = move.x + ' ' + move.y;
    if (isWithinBounds(move) && boardState[coordinateKey].isOccupied) {
      if (isHostile(selectedSquare, boardState[coordinateKey])) {
        legalMoves.push(coordinateKey);
      }
      return true;
    } else if (isWithinBounds(move)) {
      legalMoves.push(coordinateKey);
    }
  });

  potentialMovesSouthWest.some(move => {
    const coordinateKey = move.x + ' ' + move.y;
    if (isWithinBounds(move) && boardState[coordinateKey].isOccupied) {
      if (isHostile(selectedSquare, boardState[coordinateKey])) {
        legalMoves.push(coordinateKey);
      }
      return true;
    } else if (isWithinBounds(move)) {
      legalMoves.push(coordinateKey);
    }
  });

  potentialMovesNorthEast.some(move => {
    const coordinateKey = move.x + ' ' + move.y;
    if (isWithinBounds(move) && boardState[coordinateKey].isOccupied) {
      if (isHostile(selectedSquare, boardState[coordinateKey])) {
        legalMoves.push(coordinateKey);
      }
      return true;
    } else if (isWithinBounds(move)) {
      legalMoves.push(coordinateKey);
    }
  });

  potentialMovesNorthWest.some(move => {
    const coordinateKey = move.x + ' ' + move.y;
    if (isWithinBounds(move) && boardState[coordinateKey].isOccupied) {
      if (isHostile(selectedSquare, boardState[coordinateKey])) {
        legalMoves.push(coordinateKey);
      }
      return true;
    } else if (isWithinBounds(move)) {
      legalMoves.push(coordinateKey);
    }
  });

  return legalMoves;
}

function isWithinBounds(coordinates: Coordinates) {
  return coordinates.y > 0 && coordinates.y < 9 && coordinates.x > 0 && coordinates.x < 9;
}
