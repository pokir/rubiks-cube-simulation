class RubiksCubePiece {
  constructor(faces, pos, relativePos) {
    // faces should be a RubiksCubePieceFaces instance
    // relativePos is the position in the cube in terms of offsets from the center

    // the position in the cube
    this.relativePos = relativePos.copy();

    this.transform = new Transform();

    // set the position
    this.transform.translate(pos.x, pos.y, pos.z);

    this.faces = faces;
  }

  loop() {
    push();

    applyMatrix(this.transform.toArray());

    this.faces.loop();

    pop();
  }
}
