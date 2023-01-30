class RubiksCubeController {
  static BaseMoves = ['U', 'D', 'R', 'L', 'F', 'B', 'M', 'E', 'S', 'x', 'y', 'z'];

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

  parseInstruction(instruction, speed) {
    // instruction must be a string

    const normalMoveRegex = /^(\d*)([LRFBUD])(w?)(2?)('?)$/;
    const sliceMoveRegex = /^([MES])(2?)('?)$/;
    const rotationMoveRegex = /^([xyz])(2?)('?)$/;

    let axis;
    let startLayerIndex;
    let endLayerIndex;
    let layerOffset = 0;
    let clockwise = true;
    let wide = false;
    let twice = false;

    let match;

    if ((match = instruction.match(normalMoveRegex)) !== null) {
      const wide = match[3] === 'w';

      axis = RubiksCube.Axis[{
        'L': 'X', 'R': 'X',
        'U': 'Y', 'D': 'Y',
        'F': 'Z', 'B': 'Z'
      }[match[2]]];

      let layerOffset = 0;

      if (match[1])
        layerOffset = Number.parseInt(match[1]) - 1;

      if (layerOffset === 0 && wide)
        layerOffset += 1;

      if (['R', 'F', 'D'].includes(match[2])) {
        startLayerIndex = this.rubiksCube.dimensions - 1 - layerOffset;

        if (wide)
          endLayerIndex = this.rubiksCube.dimensions - 1;
        else
          endLayerIndex = startLayerIndex;
      } else {
        endLayerIndex = layerOffset;

        if (wide)
          startLayerIndex = 0;
        else
          startLayerIndex = endLayerIndex
      }

      if (match[4])
        twice = true;

      if (match[5])
        clockwise = false;

      // flip the direction for some faces
      clockwise ^= ['L', 'B', 'U'].includes(match[2]);

    } else if ((match = instruction.match(sliceMoveRegex)) !== null) {
      axis = RubiksCube.Axis[{'M': 'X', 'E': 'Y', 'S': 'Z'}[match[1]]];

      startLayerIndex = Math.floor(this.rubiksCube.dimensions / 2);
      endLayerIndex = startLayerIndex;

      if (match[2])
        twice = true;

      if (match[3])
        clockwise = false;

      // flip the direction for M
      clockwise ^= match[1] === 'M';

    } else if ((match = instruction.match(rotationMoveRegex)) !== null) {
      axis = RubiksCube.Axis[match[1].toUpperCase()];

      startLayerIndex = 0;
      endLayerIndex = this.rubiksCube.dimensions - 1;

      if (match[2])
        twice = true;

      if (match[3])
        clockwise = false;

    } else {
      console.log(instruction);
      throw Error('invalid Rubik\'s cube move');
    }

    const animationTransformPairs = [];

    for (let i = startLayerIndex; i < endLayerIndex + 1; ++i) {
      animationTransformPairs.push(
        ...this.rubiksCube.getLayerRotationAnimationTransformPairs(
          axis,
          i,
          clockwise,
          twice ? 2 : 1,
          speed
        )
      );
    }

    this.rubiksCube.applyAnimationTransformPairs(animationTransformPairs);
  }

  parseInstructions(instructions, speed) {
    // instructions must be an array of strings (example: ['R', 'L\'', 'Uw'])

    for (const instruction of instructions) {
      this.parseInstruction(instruction, speed);
    }
  }

  shuffle(numberOfMoves = 40) {
    let instructions = [];

    const layerRotationMoves = RubiksCubeController.BaseMoves
      .filter(move => !['x', 'y', 'z'].includes(move));

    for (let i = 0; i < numberOfMoves; ++i) {
      const randomIndex = Math.floor(Math.random() * layerRotationMoves.length);

      let move = layerRotationMoves[randomIndex];

      if (!['M', 'E', 'S'].includes(move) && Math.random() < 0.1)
        move += 'w';

      if (Math.random() < 0.5)
        move += '\'';

      instructions.push(move);
    }

    this.parseInstructions(instructions, 1 / 100);
  }
}
