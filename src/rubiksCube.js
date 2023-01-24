class RubiksCube {
  constructor(width) {
    this.width = width;

    this.pos = createVector(0, 0, 0);
    this.rot = createVector(0, 0, 0);

    this.pieces = [];

    for (let x_offset = -1; x_offset < 2; ++x_offset) {
      for (let y_offset = -1; y_offset < 2; ++y_offset) {
        for (let z_offset = -1; z_offset < 2; ++z_offset) {
          this.pieces.push(new RubiksCubePiece(
            new RubiksCubePieceFaces(
              y_offset === -1, // white
              x_offset === -1, // red
              z_offset === 1, // blue
              x_offset === 1, // orange
              z_offset === -1, // green
              y_offset === 1, // yellow
              this.width / 3,
            ),
            createVector(
              1.1 * x_offset * this.width / 3,
              1.1 * y_offset * this.width / 3,
              1.1 * z_offset * this.width / 3
            ),
            createVector(x_offset, y_offset, z_offset)
          ));
        }
      }
    }
  }

  loop() {
    push();

    translate(this.pos.x, this.pos.y, this.pos.z);
    rotateX(this.rot.x);
    rotateY(this.rot.y);
    rotateZ(this.rot.z);

    for (const piece of this.pieces) {
      piece.loop();
    }

    pop();
  }

  getPieceByOffset(x_offset, y_offset, z_offset) {
    for (const piece of this.pieces) {
      if (
        piece.relativePos.x === x_offset
        && piece.relativePos.y === y_offset
        && piece.relativePos.z === z_offset) {
        return piece;
      }
    }

    return null
  }

  /*setPieceByOffset(x_offset, y_offset, z_offset, piece) {
    // Sets a piece by the relative coordinates, and returns the old piece
    // NOTE: this does not change the position or rotation of the piece

    const oldPiece = this.getPieceByOffset(x_offset, y_offset, z_offset);

    this.pieces[x_offset + 1][y_offset + 1][z_offset + 1] = piece;

    return oldPiece;
  }*/

  getPiecesOfFace(face) {
    // face must be a RubiksCubeFace
    // Returns the pieces of the face (order: left to right, top to bottom)

    let selectedPieces = [];

    for (let i_offset = -1; i_offset < 2; ++i_offset) {
      selectedPieces.push([]);

      for (let j_offset = -1; j_offset < 2; ++j_offset) {
        let x_offset;
        let y_offset;
        let z_offset;

        switch (face) {
          case RubiksCubeFace.White:
            x_offset = i_offset;
            y_offset = -1;
            z_offset = j_offset;
            break;

          case RubiksCubeFace.Red:
            x_offset = -1;
            y_offset = i_offset;
            z_offset = -j_offset;
            break;

          case RubiksCubeFace.Blue:
            x_offset = i_offset;
            y_offset = j_offset;
            z_offset = 1;
            break;

          case RubiksCubeFace.Orange:
            x_offset = 1;
            y_offset = i_offset;
            z_offset = j_offset;
            break;

          case RubiksCubeFace.Green:
            x_offset = -i_offset;
            y_offset = j_offset;
            z_offset = -1;
            break;

          case RubiksCubeFace.Yellow:
            x_offset = i_offset;
            y_offset = 1;
            z_offset = -j_offset;
            break;

          default:
            break;
        }
        
        console.log(x_offset, y_offset, z_offset);

        selectedPieces[i_offset + 1].push(this.getPieceByOffset(x_offset, y_offset, z_offset));
      }
    }

    return selectedPieces;
  }

  rotateFaceClockwise(face) {
    // clockwise is a boolean (true = clockwise, false = counterclockwise)

    let facePieces = this.getPiecesOfFace(face);

    function reassignByRotating(propertyName) {
      [
        facePieces[0][0][propertyName], facePieces[0][1][propertyName], facePieces[0][2][propertyName],
        facePieces[1][0][propertyName], facePieces[1][1][propertyName], facePieces[1][2][propertyName],
        facePieces[2][0][propertyName], facePieces[2][1][propertyName], facePieces[2][2][propertyName],
      ] = [
        facePieces[2][0][propertyName], facePieces[1][0][propertyName], facePieces[0][0][propertyName],
        facePieces[2][1][propertyName], facePieces[1][1][propertyName], facePieces[0][1][propertyName],
        facePieces[2][2][propertyName], facePieces[1][2][propertyName], facePieces[0][2][propertyName],
      ];
    }

    // rotate the pieces' actual coordinate positions and their relative positions
    reassignByRotating('pos');
    reassignByRotating('relativePos');

    // rotate the angles

    for (const row of facePieces) {
      for (const piece of row) {
        switch (face) {
          case RubiksCubeFace.White:
            piece.rotateBy(createVector(0, -90, 0));
            break;

          case RubiksCubeFace.Red:
            piece.rotateBy(createVector(-90, 0, 0));
            break;

          case RubiksCubeFace.Blue:
            piece.rotateBy(createVector(0, 0, 90));
            break;

          case RubiksCubeFace.Orange:
            piece.rotateBy(createVector(90, 0, 0));
            break;

          case RubiksCubeFace.Green:
            piece.rotateBy(createVector(0, 0, -90));
            break;

          case RubiksCubeFace.Yellow:
            piece.rotateBy(createVector(0, 90, 0));
            break;

          default:
            break;
        }
      }
    }
  }

  rotateCubeBy(rotation) {
    this.rot.add(rotation);
  }
}


class RubiksCubePiece {
  constructor(faces, pos, relativePos) {
    // colors should be a RubiksCubePieceColors instance
    // relativePos is the position in the cube in terms of offsets from the center

    this.pos = pos.copy();
    this.rot = createVector(0, 0, 0);
    this.relativePos = relativePos.copy();

    this.targetPos = this.pos.copy();
    this.targetRot = this.rot.copy();

    this.faces = faces;
  }

  rotateBy(rotation) {
    // rotation is a 3D vector (angle on x, y, and z axes)
    this.rot.add(rotation);
  }

  loop() {
    push();

    translate(this.pos.x, this.pos.y, this.pos.z);
    rotateX(this.rot.x);
    rotateY(this.rot.y);
    rotateZ(this.rot.z);

    this.faces.loop();

    pop();
  }
}


class RubiksCubePieceFaces {
  constructor(whiteFace, redFace, blueFace, orangeFace, greenFace, yellowFace, width) {
    // each parameter is a boolean

    this.colors = {
      whiteFace:   !whiteFace ? color(0, 0, 0) : color(255, 255, 255),
      redFace:       !redFace ? color(0, 0, 0) : color(255, 0, 0),
      blueFace:     !blueFace ? color(0, 0, 0) : color(0, 0, 255),
      greenFace:   !greenFace ? color(0, 0, 0) : color(0, 255, 0),
      orangeFace: !orangeFace ? color(0, 0, 0) : color(255, 128, 0),
      yellowFace: !yellowFace ? color(0, 0, 0) : color(255, 255, 0),
    };

    this.width = width;

    this.positions = {
      whiteFace: [0, -this.width / 2, 0],
      redFace: [-this.width / 2, 0, 0],
      blueFace: [0, 0, this.width / 2],
      greenFace: [0, 0, -this.width / 2],
      orangeFace: [this.width / 2, 0, 0],
      yellowFace: [0, this.width / 2, 0],
    }

    this.rotations = {
      whiteFace: [90, 0, 0],
      redFace: [0, 90, 0],
      blueFace: [0, 0, 0],
      greenFace: [0, 0, 0],
      orangeFace: [0, 90, 0],
      yellowFace: [90, 0, 0],
    };
  }

  loop() {
    push();

    noStroke();
    angleMode(DEGREES);

    for (const face in this.colors) {
      push();

      fill(this.colors[face]);

      translate(...this.positions[face]);
      rotateX(this.rotations[face][0]);
      rotateY(this.rotations[face][1]);
      rotateZ(this.rotations[face][2]);

      plane(this.width, this.width);

      pop();
    }

    pop();
  }
}


const RubiksCubeFace = {
  White: 0,
  Red: 1,
  Blue: 2,
  Orange: 3,
  Green: 4,
  Yellow: 5,
};
