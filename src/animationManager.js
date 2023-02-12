class AnimationManager {
  // Class to manage the order of animations

  constructor() {
    this.animationStack = [];
  }

  addAnimations(animationTransformPairs) {
    // animationTransformPairs must be an array of [Animation, Transform]

    this.animationStack.push(animationTransformPairs);
  }

  update() {
    if (this.animationStack.length === 0)
      return;

    // start all the animations at once
    const startTime = millis();
    for (const [animation, transform] of this.animationStack[0]) {
      if (!animation.animationStarted)
        animation.start(transform, startTime);
    }

    let done = true;

    for (const [animation, transform] of this.animationStack[0]) {
      // checking if it is done before applying the next frame of the
      // animation ensures that the animation will finish completely
      if (!animation.isDone())
        done = false;

      transform.set(animation.next());
    }

    // remove the animations from the stack if all are finished
    if (done)
      this.animationStack.shift();
  }
}
