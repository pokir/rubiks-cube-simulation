class RubiksCubePiece {
  constructor(faces, pos, relativePos) {
    // faces should be a RubiksCubePieceFaces instance
    // relativePos is the position in the cube in terms of offsets from the center

    this.relativePos = relativePos.copy(); // position in the cube

    this.animationManager = new AnimationManager();

    // set the position
    this.animationManager.translate(pos.x, pos.y, pos.z, true);

    this.faces = faces;
  }

  loop() {
    this.animationManager.loop();

    push();

    applyMatrix(this.animationManager.transform.toArray());

    this.faces.loop();

    pop();
  }
}
