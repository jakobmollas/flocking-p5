'use strict'

const flock = [];
let animate = true;
let showFramerate = true;
let showQuadtree = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  for(let i = 0; i < 250; i++)  {
    flock.push(new Boid(random(windowWidth), random(windowHeight)));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseDragged() {
  if (mouseButton === LEFT)
    flock.push(new Boid(mouseX, mouseY));
}

function keyTyped() {
  switch (key) {
    case "a": 
      animate = !animate;
      print(animate ? "Running" : "Paused");
      break;

    case "f": 
      showFramerate = !showFramerate;
      break;

    case "q": 
      showQuadtree = !showQuadtree;
      break;

    default:
      // Prevent default behavior
      return false;
  }
}

function draw() {
  if (showFramerate)
    drawFramerate();

  if (!animate)
    return;

  background(0, 10);

  let qtBoundary = new Rectangle(windowWidth / 2, windowHeight / 2, windowWidth / 2, windowHeight / 2);
  let qt = new QuadTree(qtBoundary, 4);

  for (let boid of flock)
    qt.insert(boid.position.x, boid.position.y);

  if (showQuadtree)
    qt.draw();

  for (let boid of flock) {
    adjustRepulsor(boid);
    boid.update(flock, qt);
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

function drawFramerate() {
  // Clear background
  fill(0);
  stroke(0);
  rect(5, 5, 60, 20);
  
  textSize(12);
  fill(255);
  stroke(0);

  let fps = frameRate();
  text("FPS: " + fps.toFixed(), 10, 20);
}