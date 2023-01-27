class RubiksCubeController {
  static BaseMove = {
    'U': 0,
    'D': 1,
    'R': 2,
    'L': 3,
    'F': 4,
    'B': 5,
    'M': 6,
    'E': 7,
    'S': 8,
    'x': 9,
    'y': 10,
    'z': 11
  };

  static OriginalFacePositions = {
    White: [0, -1, 0],
    Yellow: [0, 1, 0],
    Blue: [0, 0, 1],
    Green: [0, 0, -1],
    Red: [-1, 0, 0],
    Orange: [1, 0, 0]
  };

  constructor(rubiksCube) {
    this.rubiksCube = rubiksCube;

    // store the face positions to know how the cube is oriented

    this.currentFaceTransforms = {};

    for (const layerName in RubiksCube.RubiksCubeLayer) {
      // skip the middle layers
      if (!RubiksCubeController.OriginalFacePositions.hasOwnProperty(layerName))
        continue;

      let transform = new Transform();
      transform.translate(...RubiksCubeController.OriginalFacePositions[layerName]);
      this.currentFaceTransforms[layerName] = transform;
    }
  }

  getMiddleLayerNextToFaceLayer(faceLayer) {
    let faceLayerName;

    for (const layerName in RubiksCube.RubiksCubeLayer) {
      if (RubiksCube.RubiksCubeLayer[layerName] === faceLayer)
        faceLayerName = layerName;
    }

    // find the middle layer which includes the face name in it
    for (const layerName in RubiksCube.RubiksCubeLayer) {
      if (layerName.includes(faceLayerName) && layerName !== faceLayerName)
        return RubiksCube.RubiksCubeLayer[layerName];
    }
  }

  getLayerFromBaseMove(baseMove) {
    // Returns the RubiksCube layer for the baseMove relative to the current
    // cube orientation

    let facePosition = [];
    let isSliceMove = false;

    switch (baseMove) {
      case RubiksCubeController.BaseMove.U:
        facePosition = RubiksCubeController.OriginalFacePositions.White;
        break;
      case RubiksCubeController.BaseMove.D:
        facePosition = RubiksCubeController.OriginalFacePositions.Yellow;
        break;
      case RubiksCubeController.BaseMove.L:
        facePosition = RubiksCubeController.OriginalFacePositions.Red;
        break;
      case RubiksCubeController.BaseMove.R:
        facePosition = RubiksCubeController.OriginalFacePositions.Orange;
        break;
      case RubiksCubeController.BaseMove.F:
        facePosition = RubiksCubeController.OriginalFacePositions.Blue;
        break;
      case RubiksCubeController.BaseMove.B:
        facePosition = RubiksCubeController.OriginalFacePositions.Green;
        break;
      case RubiksCubeController.BaseMove.M:
        facePosition = RubiksCubeController.OriginalFacePositions.Red;
        isSliceMove = true;
        break;
      case RubiksCubeController.BaseMove.E:
        facePosition = RubiksCubeController.OriginalFacePositions.White;
        isSliceMove = true;
        break;
      case RubiksCubeController.BaseMove.S:
        facePosition = RubiksCubeController.OriginalFacePositions.Green;
        isSliceMove = true;
        break;

      default:
        break;
    }

    let selectedLayerName;

    // find the layer name from the layer position
    for (const faceName in this.currentFaceTransforms) {
      if (
        this.currentFaceTransforms[faceName].extractTranslation()
          .every((value, index) => {
            // round the value because the transformation is not exact
            return Math.round(value) === facePosition[index];
          })
      ) {
        selectedLayerName = faceName;
        break;
      }
    }

    // if it is a slice, get the middle layer instead
    if (isSliceMove)
      return this.getMiddleLayerNextToFaceLayer(RubiksCube.RubiksCubeLayer[selectedLayerName]);

    return RubiksCube.RubiksCubeLayer[selectedLayerName];
  }

  flipDirectionForSliceMove(middleLayer, baseMove) {
    // Returns a boolean for whether to flip the direction of the rotation or not
    // for a slice move
    // middleLayer: the middle layer to turn for the slice move
    // baseMove: the slice move

    // get the layer next to the middle layer
    let adjacentFace;

    switch (baseMove) {
      case RubiksCubeController.BaseMove.M:
        adjacentFace = this.getLayerFromBaseMove(RubiksCubeController.BaseMove.L);
        break;

      case RubiksCubeController.BaseMove.E:
        adjacentFace = this.getLayerFromBaseMove(RubiksCubeController.BaseMove.D);
        break;

      case RubiksCubeController.BaseMove.S:
        adjacentFace = this.getLayerFromBaseMove(RubiksCubeController.BaseMove.F);
        break;

      default:
        break;
    }

    return (
      (
        middleLayer === RubiksCube.RubiksCubeLayer.WhiteYellow
        && adjacentFace === RubiksCube.RubiksCubeLayer.Yellow
      ) || (
        middleLayer === RubiksCube.RubiksCubeLayer.BlueGreen
        && adjacentFace === RubiksCube.RubiksCubeLayer.Green
      ) || (
        middleLayer === RubiksCube.RubiksCubeLayer.RedOrange
        && adjacentFace === RubiksCube.RubiksCubeLayer.Orange
      )
    );
  }

  parseInstruction(instruction, speed) {
    // instruction must be a string

    let baseMoveName;
    let clockwise = true;
    let wide = false;
    let twice = false;

    for (const character of instruction) {
      if (character === '\'')
        clockwise = false;
      else if (character === 'w')
        wide = true;
      else if (character === '2')
        twice = true;
      else
        baseMoveName = character;
    }

    let baseMove = RubiksCubeController.BaseMove[baseMoveName];

    if (['x', 'y', 'z'].includes(baseMoveName)) {
      // Cube rotation moves
      const angle = (twice ? 2 : 1) * (clockwise * 2 - 1) * math.pi / 2;
      const axis = RubiksCube.RotationAxis[baseMoveName.toUpperCase()];

      this.rubiksCube.rotateCube(angle, axis, speed);

      for (const faceName in this.currentFaceTransforms) {
        this.currentFaceTransforms[faceName].rotate(angle, axis);
      }
    } else if (['M', 'E', 'S'].includes(baseMoveName)) {
        // Slice moves
        const layer = this.getLayerFromBaseMove(baseMove);
        const flipDirection = this.flipDirectionForSliceMove(layer, baseMove);
        this.rubiksCube.rotateLayer(layer, flipDirection ^ clockwise, twice ? 2 : 1, speed);
    } else {
        // Face moves
        const layer = this.getLayerFromBaseMove(baseMove);

        if (wide) {
          let middleLayer = this.getMiddleLayerNextToFaceLayer(layer);

          const flipDirectionForMiddleLayer = (
            [
              RubiksCubeController.BaseMove.D,
              RubiksCubeController.BaseMove.R,
              RubiksCubeController.BaseMove.B
            ].includes(baseMove)
          );

          const animationTransformPairs = [];

          animationTransformPairs.push(
            ...this.rubiksCube.getLayerRotationAnimationTransformPairs(
              middleLayer,
              flipDirectionForMiddleLayer ^ clockwise,
              twice ? 2 : 1,
              speed
            )
          );

          animationTransformPairs.push(
            ...this.rubiksCube.getLayerRotationAnimationTransformPairs(
              layer,
              clockwise,
              twice ? 2 : 1,
              speed
            )
          );

          this.rubiksCube.applyAnimationTransformPairs(animationTransformPairs);
        } else {
          this.rubiksCube.rotateLayer(layer, clockwise, twice ? 2 : 1, speed);
        }
    }
  }

  parseInstructions(instructions, speed) {
    // instructions must be an array of strings (example: ['R', 'L\'', 'Uw'])

    for (const instruction of instructions) {
      this.parseInstruction(instruction, speed);
    }
  }

  shuffle(numberOfMoves = 40) {
    let instructions = [];

    const layerRotationMoves = Object.keys(RubiksCubeController.BaseMove)
      .filter(move => !['x', 'y', 'z'].includes(move));

    for (let i = 0; i < numberOfMoves; ++i) {
      const randomIndex = Math.floor(Math.random() * layerRotationMoves.length);

      let move = layerRotationMoves[randomIndex];

      if (Math.random() < 0.1)
        move += 'w';

      if (Math.random() < 0.5)
        move += '\'';

      instructions.push(move);
    }

    this.parseInstructions(instructions, 1 / 100);
  }
}
