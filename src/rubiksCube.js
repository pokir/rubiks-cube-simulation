class RubiksCube {
  static Axis = {
    X: [1, 0, 0],
    Y: [0, 1, 0],
    Z: [0, 0, 1],
  };

  constructor(width, dimensions) {
    // width is the size of the cube
    // dimensions is an integer (3 for 3x3 Rubik's Cube, 4 for 4x4 Rubik's Cube, etc.)

    this.width = width;
    this.dimensions = dimensions;

    this.transform = new Transform();

    this.animationManager = new AnimationManager();

    this.pieces = [];

    for (let xOffset = 0; xOffset < this.dimensions; ++xOffset) {
      for (let yOffset = 0; yOffset < this.dimensions; ++yOffset) {
        for (let zOffset = 0; zOffset < this.dimensions; ++zOffset) {

          // if it is a hidden piece, don't bother creating it (to reduce lag)
          if (![xOffset, yOffset, zOffset].includes(0) && ![xOffset, yOffset, zOffset].includes(this.dimensions - 1))
            continue;

          this.pieces.push(new RubiksCubePiece(
            new RubiksCubePieceFaces(
              yOffset === 0,                   // white
              xOffset === 0,                   // red
              zOffset === this.dimensions - 1, // blue
              xOffset === this.dimensions - 1, // orange
              zOffset === 0,                   // green
              yOffset === this.dimensions - 1, // yellow
              0.9 * this.width / this.dimensions
            ),
            createVector(
              (xOffset - this.dimensions / 2 + 1 / 2) * this.width / this.dimensions,
              (yOffset - this.dimensions / 2 + 1 / 2) * this.width / this.dimensions,
              (zOffset - this.dimensions / 2 + 1 / 2) * this.width / this.dimensions
            ),
            createVector(xOffset, yOffset, zOffset)
          ));
        }
      }
    }
  }

  update() {
    this.animationManager.update();
  }

  draw() {
    push();

    applyMatrix(this.transform.toArray());

    for (const piece of this.pieces) {
      piece.draw();
    }

    pop();
  }

  getPieceByOffset(xOffset, yOffset, zOffset) {
    if (![xOffset, yOffset, zOffset].every(v => v >= 0 && v < this.dimensions))
      throw new Error('relative position is not in valid range');

    for (const piece of this.pieces) {
      if (
        // NOTE: .toString() is needed to compare arrays
        piece.relativePos.extractTranslation().toString()
        === [xOffset, yOffset, zOffset].toString()
      ) {
        return piece;
      }
    }

    return null;
  }

  getPiecesOfLayer(layerAxis, layerIndex) {
    // layerAxis must be an Axis
    // Returns the pieces of the layer (order: left to right, top to bottom, indexing : [x][y])

    let selectedPieces = [];

    for (let iOffset = 0; iOffset < this.dimensions; ++iOffset) {
      selectedPieces.push([]);

      for (let jOffset = 0; jOffset < this.dimensions; ++jOffset) {
        let relativePosition = [iOffset, jOffset];
        relativePosition.splice(layerAxis.indexOf(1), 0, layerIndex);

        selectedPieces[iOffset].push(this.getPieceByOffset(...relativePosition));
      }
    }

    return selectedPieces;
  }

  getLayerRotationAnimationTransformPairs(layerAxis, layerIndex, clockwise = true, amount = 1, speed = 1 / 400) {
    // clockwise is a boolean (true = clockwise, false = counterclockwise)
    // amount is the number of turns to do

    let layerPieces = this.getPiecesOfLayer(layerAxis, layerIndex);

    const sign = clockwise * 2 - 1;

    let animationTransformPairs = [];

    for (const row of layerPieces) {
      for (const piece of row) {
        // ignore hidden pieces
        if (piece === null)
          continue;

        // rotate the selected layer around the center of the cube
        piece.relativePos.translate(-this.dimensions / 2 + 1 / 2, -this.dimensions / 2 + 1 / 2, -this.dimensions / 2 + 1 / 2);
        piece.relativePos.rotate(amount * sign * Math.PI / 2, layerAxis);
        piece.relativePos.translate(this.dimensions / 2 - 1 / 2, this.dimensions / 2 - 1 / 2, this.dimensions / 2 - 1 / 2);

        // round the values because the rotation is not exact
        // NOTE: this does not edit the relativePos object (and shouldn't
        piece.relativePos.matrix = math.round(piece.relativePos.matrix)

        // add the animation
        animationTransformPairs.push([
          new Animation(
            Animation.TransformationType.Rotation,
            amount / speed,
            //Animation.TransitionType.Linear,
            Animation.TransitionType.Sine,
            {angle: sign * amount * Math.PI / 2, axis: layerAxis}
          ),
          piece.transform
        ]);
      }
    }

    return animationTransformPairs;
  }

  applyAnimationTransformPairs(animationTransformPairs) {
    this.animationManager.addAnimations(animationTransformPairs);
  }

  rotateLayer(layerAxis, layerIndex, clockwise, amount, speed) {
    const animationTransformPairs = this.getLayerRotationAnimationTransformPairs(
      layerAxis,
      layerIndex,
      clockwise,
      amount,
      speed
    );
    this.applyAnimationTransformPairs(animationTransformPairs);
  }
}
