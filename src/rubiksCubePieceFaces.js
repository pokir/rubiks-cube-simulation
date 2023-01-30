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
    };

    this.rotations = {
      whiteFace: [90, 0],
      redFace: [0, 90],
      blueFace: [0, 0],
      greenFace: [0, 0],
      orangeFace: [0, 90],
      yellowFace: [90, 0],
    };
  }

  draw() {
    push();

    noStroke();
    angleMode(DEGREES);

    for (const face in this.colors) {
      push();

      fill(this.colors[face]);

      translate(...this.positions[face]);
      rotateX(this.rotations[face][0]);
      rotateY(this.rotations[face][1]);

      plane(this.width, this.width);

      pop();
    }

    pop();
  }
}
