'use strict'

let flock = [];
let animate = true;
let showDiagnostics = true;
let showQuadtree = false;
let quadTreeSize = 32;
let boidCount = 300;

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('display', 'block');

  textFont('monospace');

  initializeBoids();
}

function initializeBoids() {
  flock = [];

  for(let i = 0; i < boidCount; i++)  {
    flock.push(new Boid(random(windowWidth), random(windowHeight)));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseDragged() {
  if (mouseButton === LEFT)
    flock.push(new Boid(mouseX, mouseY));
    boidCount++;
}

function keyTyped() {
  switch (key) {
    case "a": 
      animate = !animate;
      print(animate ? "Running" : "Paused");
      break;

    case "d": 
    showDiagnostics = !showDiagnostics;
      break;

    case "q": 
      showQuadtree = !showQuadtree;
      break;

    default:
      // Prevent default behavior
      return false;
  }
}

function keyPressed() {
  switch (keyCode) {
    case RIGHT_ARROW: 
      if (quadTreeSize < 1024)
        quadTreeSize *= 2;
      break;

    case LEFT_ARROW: 
      if (quadTreeSize > 1)
        quadTreeSize /= 2;
      break;

      case UP_ARROW: 
      boidCount += 50;
      initializeBoids();
      break;

    case DOWN_ARROW: 
      if (boidCount > 50) {
        boidCount -= 50;
        initializeBoids();
      }
      break;
  }
}

function draw() {
  if (showDiagnostics)
    drawDiagnostics();

  if (!animate)
    return;

  background(0, 10);

  let qtBoundary = new Rectangle(windowWidth / 2, windowHeight / 2, windowWidth / 2, windowHeight / 2);
  let qt = new QuadTree(qtBoundary, quadTreeSize);

  for (let boid of flock)
    qt.insert(boid.position.x, boid.position.y, boid);

  if (showQuadtree)
    qt.draw();

  for (let boid of flock) {
    adjustRepulsor(boid);
    boid.update(qt);
    boid.draw();
  }
}

function adjustRepulsor(boid) {
  let rightMousePressed = mouseIsPressed && mouseButton === RIGHT;

  if (rightMousePressed)
    boid.setRepulsor(mouseX, mouseY);
  else 
    boid.clearRepulsor();
}

function drawDiagnostics() {
  // Clear background
  fill(0);
  stroke(0);
  rectMode(CORNER)
  rect(5, 5, 100, 60);
  
  textSize(12);
  fill(255);
  stroke(0);

  let fps = frameRate();
  text("FPS:     " + fps.toFixed(), 10, 20);
  text("Boids:   " + flock.length, 10, 40)
  text("QT Size: " + quadTreeSize, 10, 60)

}