const RubiksCubeFace = {
  White: 0,
  Red: 1,
  Blue: 2,
  Orange: 3,
  Green: 4,
  Yellow: 5,
};


const RotationAxis = {
  X: [1, 0, 0],
  Y: [0, 1, 0],
  Z: [0, 0, 1],
};


class RubiksCube {
  constructor(width) {
    this.width = width;

    this.transform = new Transform();

    this.pieces = [];

    for (let xOffset = -1; xOffset < 2; ++xOffset) {
      for (let yOffset = -1; yOffset < 2; ++yOffset) {
        for (let zOffset = -1; zOffset < 2; ++zOffset) {
          this.pieces.push(new RubiksCubePiece(
            new RubiksCubePieceFaces(
              yOffset === -1, // white
              xOffset === -1, // red
              zOffset === 1, // blue
              xOffset === 1, // orange
              zOffset === -1, // green
              yOffset === 1, // yellow
              0.9 * this.width / 3,
            ),
            createVector(
              xOffset * this.width / 3,
              yOffset * this.width / 3,
              zOffset * this.width / 3
            ),
            createVector(xOffset, yOffset, zOffset)
          ));
        }
      }
    }
  }

  loop() {
    push();

    applyMatrix(this.transform.toArray());

    for (const piece of this.pieces) {
      piece.loop();
    }

    pop();
  }

  getPieceByOffset(xOffset, yOffset, zOffset) {
    for (const piece of this.pieces) {
      if (
        piece.relativePos.x === xOffset
        && piece.relativePos.y === yOffset
        && piece.relativePos.z === zOffset) {
        return piece;
      }
    }

    return null;
  }

  getPiecesOfFace(face) {
    // TODO: it doesnt give the pices in the correct order!!
    // face must be a RubiksCubeFace
    // Returns the pieces of the face (order: left to right, top to bottom, indexing : [x][y])

    let selectedPieces = [];

    for (let iOffset = -1; iOffset < 2; ++iOffset) {
      selectedPieces.push([]);

      for (let jOffset = -1; jOffset < 2; ++jOffset) {
        let xOffset;
        let yOffset;
        let zOffset;

        switch (face) {
          case RubiksCubeFace.White:
            xOffset = iOffset;
            yOffset = -1;
            zOffset = jOffset;
            break;

          case RubiksCubeFace.Red:
            xOffset = -1;
            yOffset = jOffset;
            zOffset = iOffset;
            break;

          case RubiksCubeFace.Blue:
            xOffset = iOffset;
            yOffset = jOffset;
            zOffset = 1;
            break;

          case RubiksCubeFace.Orange:
            xOffset = 1;
            yOffset = jOffset;
            zOffset = -iOffset;
            break;

          case RubiksCubeFace.Green:
            xOffset = -iOffset;
            yOffset = jOffset;
            zOffset = -1;
            break;

          case RubiksCubeFace.Yellow:
            xOffset = iOffset;
            yOffset = 1;
            zOffset = -jOffset;
            break;

          default:
            break;
        }

        selectedPieces[iOffset + 1].push(this.getPieceByOffset(xOffset, yOffset, zOffset));
      }
    }

    return selectedPieces;
  }

  rotateFace(face, clockwise = true, amount = 1) {
    // clockwise is a boolean (true = clockwise, false = counterclockwise)
    // amount is the number of turns to do

    let facePieces = this.getPiecesOfFace(face);

    function reassignByRotatingCounterclockwise(propertyName) {
      [
        facePieces[0][0][propertyName], facePieces[1][0][propertyName], facePieces[2][0][propertyName],
        facePieces[0][1][propertyName],                                 facePieces[2][1][propertyName],
        facePieces[0][2][propertyName], facePieces[1][2][propertyName], facePieces[2][2][propertyName],
      ] = [
        facePieces[0][2][propertyName], facePieces[0][1][propertyName], facePieces[0][0][propertyName],
        facePieces[1][2][propertyName],                                 facePieces[1][0][propertyName],
        facePieces[2][2][propertyName], facePieces[2][1][propertyName], facePieces[2][0][propertyName],
      ];
    }

    // rotate the pieces' actual coordinate positions and their relative positions

    for (let i = 0; i < amount * (1 + clockwise * 2); ++i) {
      reassignByRotatingCounterclockwise('relativePos');
    }

    const sign = clockwise * 2 - 1;

    // rotate the angles
    for (const row of facePieces) {
      for (const piece of row) {
        switch (face) {
          case RubiksCubeFace.White:
            piece.targetTransform.rotate(-sign * amount * math.pi/2, RotationAxis.Y)
            break;

          case RubiksCubeFace.Red:
            piece.targetTransform.rotate(-sign * amount * math.pi/2, RotationAxis.X)
            break;

          case RubiksCubeFace.Blue:
            piece.targetTransform.rotate(sign * amount * math.pi/2, RotationAxis.Z)
            break;

          case RubiksCubeFace.Orange:
            piece.targetTransform.rotate(sign * amount * math.pi/2, RotationAxis.X)
            break;

          case RubiksCubeFace.Green:
            piece.targetTransform.rotate(-sign * amount * math.pi/2, RotationAxis.Z)
            break;

          case RubiksCubeFace.Yellow:
            piece.targetTransform.rotate(sign * amount * math.pi/2, RotationAxis.Y)
            break;

          default:
            break;
        }
      }
    }
  }

  rotateCube(angle, axis) {
    this.targetTransform.rotate(angle, axis)
  }
}
