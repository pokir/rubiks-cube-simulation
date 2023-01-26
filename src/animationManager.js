class AnimationManager {
  // Class to manage the order of animations

  constructor() {
    this.animationStack = [];
  }

  addAnimations(animationTransformPairs) {
    // animationTransformPairs must be an array of [Animation, Transform]

    this.animationStack.push(animationTransformPairs);
  }

  loop() {
    if (this.animationStack.length > 0) {
      let done = true;

      // start all the animations at once
      const startTime = millis();
      for (const [animation, transform] of this.animationStack[0]) {
        if (!animation.animationStarted)
          animation.start(transform, startTime);
      }

      for (const [animation, transform] of this.animationStack[0]) {
        transform.set(animation.next());

        if (!animation.isDone())
          done = false;
      }

      // remove the animations from the stack if all are finished
      if (done)
        this.animationStack.shift();
    }
  }
}


/*
class AnimationManager {
  constructor() {
    this.animationStack = [];

    this.transform = new Transform(); // the current transform
  }

  rotate(angle, axis, duration, cancelAnimation = false) {
    // duration must be in milliseconds

    if (cancelAnimation) {
      this.transform.rotate(angle, axis);
      return;
    }

    this.animationStack.push(new Animation(
      Animation.TransformationType.Rotation,
      duration,
      Animation.TransitionType.Linear,
      {angle, axis}
    ));
  }

  translate(x, y, z, duration, cancelAnimation = false) {
    // duration must be in milliseconds

    if (cancelAnimation) {
      this.transform.translate(x, y, z);
      return;
    }

    this.animationStack.push(new Animation(
      Animation.TransformationType.Translation,
      duration,
      Animation.TransitionType.Linear,
      {x, y, z}
    ));
  }

  loop() {
    if (this.animationStack.length > 0) {
      // keep done in a variable to make sure that this.transform reaches the
      // final state of the animation

      // start the animation if it hasn't started yet
      // TODO: don't start like this; make a method to start instead
      if (!this.animationStack[0].animationStarted)
        this.animationStack[0].start(this.transform);

      const done = this.animationStack[0].isDone();

      this.transform = this.animationStack[0].next();

      // remove the animation from the array if it is finished
      if (done)
        this.animationStack.shift();
    }
  }
}
*/