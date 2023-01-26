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
