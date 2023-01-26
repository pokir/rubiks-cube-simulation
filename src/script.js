let cube;
let controller;


function setup() {
  createCanvas(600, 600, WEBGL);

  cube = new RubiksCube(150);
  controller = new RubiksCubeController(cube);
}


function draw() {
  background(200);

  orbitControl();

  cube.loop();
}
