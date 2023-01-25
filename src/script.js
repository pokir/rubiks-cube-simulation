let cube;


function setup() {
  createCanvas(600, 600, WEBGL);

  cube = new RubiksCube(150);
}


function draw() {
  background(200);

  orbitControl();

  cube.loop();
}
