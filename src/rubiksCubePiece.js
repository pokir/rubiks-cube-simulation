class RubiksCubePiece {
  constructor(faces, pos, relativePos) {
    // faces should be a RubiksCubePieceFaces instance
    // relativePos is the position in the cube in terms of offsets from the center

    this.relativePos = relativePos.copy(); // position in the cube

    this.transform = new Transform(); // the actual transform
    this.targetTransform = new Transform(); // the goal transform

    // set the position
    this.transform.translate(pos.x, pos.y, pos.z);
    this.targetTransform.translate(pos.x, pos.y, pos.z);

    this.faces = faces;
  }

  loop() {
    this.transform.matrix = math.map(this.transform.matrix, (value, indexes) => {
      const difference = this.targetTransform.matrix.get(indexes) - value;

      return value + difference * 0.05;
    });

    push();

    applyMatrix(this.transform.toArray());

    this.faces.loop();

    pop();
  }
}
