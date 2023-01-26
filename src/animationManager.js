class AnimationManager {
  constructor() {
    this.transform = new Transform(); // the current transform

    this.referenceTransform = new Transform(); // to hold the initial transform

    // variables for rotation
    this.doingRotation = false;
    this.rotationStartTime = null;
    this.rotationDuration = null;
    this.currentRotationAngle = null;
    this.rotationAxis = null;
    this.targetRotationAngle = null;

    // variables for translation
    this.doingTranslation = false;
    this.translationStartTime = null;
    this.translationDuration = null;
    this.currentTranslationX = null;
    this.currentTranslationY = null;
    this.currentTranslationZ = null;
    this.targetTranslationX = null;
    this.targetTranslationY = null;
    this.targetTranslationZ = null;
  }

  rotate(angle, axis, duration, cancelAnimation = false) {
    // duration must be in milliseconds

    if (cancelAnimation) {
      this.transform.rotate(angle, axis);
      return;
    }

    this.doingRotation = true;
    this.rotationDuration = duration;
    this.rotationStartTime = millis();

    this.referenceTransform = this.transform.copy();

    this.targetRotationAngle = angle;
    this.rotationAxis = axis;
    this.currentRotationAngle = 0;
  }

  translate(x, y, z, duration, cancelAnimation = false) {
    // duration must be in milliseconds

    if (cancelAnimation) {
      this.transform.translate(x, y, z);
      return;
    }

    this.doingTranslation = true;
    this.translationDuration = duration;
    this.translationStartTime = millis();

    this.referenceTransform = this.transform.copy();

    this.currentTranslationX = 0;
    this.currentTranslationY = 0;
    this.currentTranslationZ = 0;

    this.targetTranslationX = x;
    this.targetTranslationY = y;
    this.targetTranslationZ = z;
  }

  loop() {
    if (this.doingRotation) {
      //this.currentRotationAngle += 0.1 * this.targetRotationAngle;
      this.currentRotationAngle = this.targetRotationAngle * (millis() - this.rotationStartTime) / this.rotationDuration;

      // ending condition
      if (millis() - this.rotationStartTime >= this.rotationDuration) {
        // rotate it to the target exactly
        this.currentRotationAngle = this.targetRotationAngle;
        this.doingRotation = false;
      }

      // reset the transform
      this.transform = this.referenceTransform.copy();

      // then rotate it by the angle
      this.transform.rotate(this.currentRotationAngle, this.rotationAxis);
    }

    if (this.doingTranslation) {
      this.currentTranslationX = this.targetTranslationX * (millis() - this.translationStartTime) / this.translationDuration;
      this.currentTranslationY = this.targetTranslationY * (millis() - this.translationStartTime) / this.translationDuration;
      this.currentTranslationZ = this.targetTranslationZ * (millis() - this.translationStartTime) / this.translationDuration;

      // ending condition
      if (millis() - this.translationStartTime > this.translationDuration) {
        // translate it to the target exactly
        this.currentTranslationX = this.targetTranslationX;
        this.currentTranslationY = this.targetTranslationY;
        this.currentTranslationZ = this.targetTranslationZ;
        this.doingTranslation = false;
      }

      // reset the transform
      this.transform = this.referenceTransform.copy();

      // then translate it by the current translation
      this.transform.translate(this.currentTranslationX, this.currentTranslationY, this.currentTranslationZ);
    }
  }
}
