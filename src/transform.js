class Transform {
  constructor() {
    this.matrix = math.identity(4, 4);
  }

  rotate(angle, axis) {
    // axis must be a unit vector (example: [0, 1, 0])
    let rotationMatrix = math.rotationMatrix(angle, axis);

    // adjust the dimensions
    rotationMatrix = math.multiply(rotationMatrix, math.identity(3,4));
    rotationMatrix = math.concat(rotationMatrix, math.matrix([[0, 0, 0, 1]]), 0);

    this.matrix = math.multiply(rotationMatrix, this.matrix);
  }

  translate(x, y, z) {
    let translationMatrix = math.identity(4, 3);
    translationMatrix = math.concat(
      translationMatrix,
      math.matrix([[x], [y], [z], [1]])
    );

    this.matrix = math.multiply(translationMatrix, this.matrix);
  }

  extractTranslation() {
    // Get the current translation of the transform in the form [x, y, z]
    return this.matrix.columns()[3].toArray().slice(0, 3).map(arr => arr[0]);
  }

  toArray() {
    return math.flatten(math.transpose(this.matrix)).toArray();
  }

  copy() {
    let copyTransform = new Transform();

    copyTransform.matrix = copyTransform.matrix.map((value, index) => {
      return this.matrix.get(index);
    });

    return copyTransform;
  }

  set(transform) {
    // Set the transform to be the same as another transform
    let newSelf = transform.copy();

    this.matrix = newSelf.matrix;
  }
}
