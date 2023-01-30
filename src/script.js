let cube;
let controller;


function setup() {
  createCanvas(600, 600, WEBGL);

  let numLayers = Number.parseInt(prompt('How many layers should the Rubik\'s Cube have? (default is 3)')) || 3;

  cube = new RubiksCube(150, numLayers);
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

  // reference point for the front face
  noStroke();
  fill(255, 255, 0);
  translate(0, 0, 200);
  sphere(5);
}
