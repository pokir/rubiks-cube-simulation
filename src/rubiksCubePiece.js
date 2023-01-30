class RubiksCubePiece {
  constructor(faces, pos, relativePos) {
    // faces should be a RubiksCubePieceFaces instance
    // relativePos is the position in the cube in terms of offsets from the center

    // the position in the cube
    this.relativePos = new Transform();
    this.relativePos.translate(relativePos.x, relativePos.y, relativePos.z);

    // the position in 3D space
    this.transform = new Transform();
    this.transform.translate(pos.x, pos.y, pos.z);

    this.faces = faces;
  }

  draw() {
    push();

    applyMatrix(this.transform.toArray());

    this.faces.draw();

    pop();
  }
}
