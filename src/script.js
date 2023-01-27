let cube;
let controller;


function setup() {
  createCanvas(600, 600, WEBGL);

  cube = new RubiksCube(150);
  controller = new RubiksCubeController(cube);

  document.querySelector('#moveInput').addEventListener('change', () => {
    try {
      controller.parseInstructions(document.querySelector('#moveInput').value.trim().replace(/\s\s+/g, ' ').split(' '));
      document.querySelector('#moveInput').value = '';
    } catch (error) {
      alert('Invalid move!');
    }
  });

  document.querySelector('#shuffleButton').addEventListener('click', () => {
    controller.shuffle();
  });
}


function draw() {
  background(200);

  orbitControl(2, 2, 0.03);

  cube.loop();
}
