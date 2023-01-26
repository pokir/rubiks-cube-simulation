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
  }

  constructor(rubiksCube) {
    this.rubiksCube = rubiksCube;
  }

  parseInstruction(instruction) {
    // instruction must be a string

    let baseMove;
    let clockwise = true;
    let wide = false;
    // TODO: add wide
    let twice = false;

    for (const character of instruction) {
      if (character === '\'')
        clockwise = false;
      else if (character === 'w')
        wide = true;
      else if (character === '2')
        twice = true;
      else
        baseMove = RubiksCubeController.BaseMove[character];
    }

    switch (baseMove) {
      case RubiksCubeController.BaseMove.U:
        this.rubiksCube.rotateLayer(RubiksCube.RubiksCubeLayer.White, clockwise, twice ? 2 : 1);
        break;

      case RubiksCubeController.BaseMove.D:
        this.rubiksCube.rotateLayer(RubiksCube.RubiksCubeLayer.Yellow, clockwise, twice ? 2 : 1);
        break;

      case RubiksCubeController.BaseMove.R:
        this.rubiksCube.rotateLayer(RubiksCube.RubiksCubeLayer.Orange, clockwise, twice ? 2 : 1);
        break;
        
      case RubiksCubeController.BaseMove.L:
        this.rubiksCube.rotateLayer(RubiksCube.RubiksCubeLayer.Red, clockwise, twice ? 2 : 1);
        break;

      case RubiksCubeController.BaseMove.F:
        this.rubiksCube.rotateLayer(RubiksCube.RubiksCubeLayer.Blue, clockwise, twice ? 2 : 1);
        break;

      case RubiksCubeController.BaseMove.B:
        this.rubiksCube.rotateLayer(RubiksCube.RubiksCubeLayer.Green, clockwise, twice ? 2 : 1);
        break;

      case RubiksCubeController.BaseMove.M:
        this.rubiksCube.rotateLayer(RubiksCube.RubiksCubeLayer.RedOrange, clockwise, twice ? 2 : 1);
        break;

      case RubiksCubeController.BaseMove.E:
        this.rubiksCube.rotateLayer(RubiksCube.RubiksCubeLayer.WhiteYellow, clockwise, twice ? 2 : 1);
        break;

      case RubiksCubeController.BaseMove.S:
        this.rubiksCube.rotateLayer(RubiksCube.RubiksCubeLayer.BlueGreen, clockwise, twice ? 2 : 1);
        break;

      case RubiksCubeController.BaseMove.x:
        this.rubiksCube.rotateCube((twice ? 2 : 1) * (clockwise * 2 - 1) * math.pi / 2, RubiksCube.RotationAxis.X);
        break;

      case RubiksCubeController.BaseMove.y:
        this.rubiksCube.rotateCube((twice ? 2 : 1) * (clockwise * 2 - 1) * math.pi / 2, RubiksCube.RotationAxis.Y);
        break;

      case RubiksCubeController.BaseMove.z:
        this.rubiksCube.rotateCube((twice ? 2 : 1) * (clockwise * 2 - 1) * math.pi / 2, RubiksCube.RotationAxis.Z);
        break;

      default:
        break;
    }
  }

  parseInstructions(instructions) {
    // instructions must be an array of strings (example: ['R', 'L\'', 'Uw'])

    for (const instruction of instructions) {
      this.parseInstruction(instruction);
    }
  }
}
