class Animation {
  static TransformationType = {
    Translation: 0,
    Rotation: 1,
  };

  static TransitionType = {
    Linear: 0,
    Sine: 1,
  };

  constructor(transformationType, duration, transitionType, targetTransformationData) {
    // transformationType must be a TransformationType
    // duration must be in milliseconds
    // transitionType must be a TansitionType
    // initialTransform is the starting transform to animate from
    // transformationData:
    // - for rotation: {angle: ?, axis: ?}
    // - for translation: {x: ?, y: ?, z: ?}

    this.transformationType = transformationType;
    this.transitionType = transitionType;

    this.duration = duration;
    this.startTime = millis();

    // don't set the initial transform until this.start() is called
    this.initialTransform = null;

    this.targetTransformationData = targetTransformationData;
    this.currentTransformationData = {};

    this.animationStarted = false;
  }

  start(initialTransform, startTimeOverride = null) {
    // Reset the time (to start the animation)
    if (startTimeOverride === null)
      this.startTime = millis();
    else
      this.startTime = startTimeOverride

    // Set the initial transform
    this.initialTransform = initialTransform.copy();

    this.animationStarted = true;
  }

  isDone() {
    // Returns if the animation completed
    return millis() - this.startTime >= this.duration;
  }

  next() {
    // Returns the current transform (time based)

    let timeSpent = millis() - this.startTime;

    // Make sure ont to continue after the animation finished
    if (timeSpent > this.duration)
      timeSpent = this.duration;

    const applyMapping = (min, max) => {
      // Gets a value between a range based on the transition type and duration

      switch (this.transitionType) {
        case Animation.TransitionType.Linear:
          return min + (max - min) * timeSpent / this.duration;
          break;

        case Animation.TransitionType.Sine:
          return min + (max - min) * (1 - Math.cos(timeSpent * Math.PI / this.duration)) / 2;
          break;

        default:
          break;
      }
    };

    let nextTransform = this.initialTransform.copy();

    switch (this.transformationType) {
      case Animation.TransformationType.Translation:
        this.currentTransformationData.x = applyMapping(0, this.targetTransformationData.x);
        this.currentTransformationData.y = applyMapping(0, this.targetTransformationData.y);
        this.currentTransformationData.z = applyMapping(0, this.targetTransformationData.z);

        nextTransform.translate(
          this.currentTransformationData.x,
          this.currentTransformationData.y,
          this.currentTransformationData.z
        );

        break;

      case Animation.TransformationType.Rotation:
        this.currentTransformationData.angle = applyMapping(0, this.targetTransformationData.angle);
        this.currentTransformationData.axis = this.targetTransformationData.axis;

        nextTransform.rotate(this.currentTransformationData.angle, this.currentTransformationData.axis);

      default:
        break;
    }

    return nextTransform;
  }
}
