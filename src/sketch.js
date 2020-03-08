'use strict'

class Settings {
  constructor() {
    this.animate = true;
    this.showDiagnostics = true;
    this.showQuadtree = false;
    this.showQuadTester = false;
    this.showObstacles = false;
    this.quadTreeSize = 32;
    this.boidCount = 250;
  }
}

let flock = [];
let obstacles = [];
let gui = null;
let settings = new Settings();

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('display', 'block');

  textFont('monospace');

  initializeBoids();
  initializeObstacles();
  initializeGuiControls();
}

function initializeGuiControls() {
  gui = new dat.GUI()
  let f1 = gui.addFolder('Switches');
  f1.add(settings, 'animate');
  f1.add(settings, 'showDiagnostics');
  f1.add(settings, 'showQuadtree');
  f1.add(settings, 'showQuadTester');
  f1.add(settings, 'showObstacles');

  gui.add(settings, 'quadTreeSize', 1, 1000);
  gui.add(settings, 'boidCount', 1, 1000).onFinishChange(n => initializeBoids());

  f1.open();
  gui.close();
}

function initializeBoids() {
  flock = [];

  for (let i = 0; i < settings.boidCount; i++) {
    flock.push(new Boid(random(windowWidth), random(windowHeight)));
  }
}

function initializeObstacles() {
  obstacles = [];
  obstacles.push(new Obstacle(random(windowWidth), random(windowHeight), random(200, 500)));
  obstacles.push(new Obstacle(random(windowWidth), random(windowHeight), random(200, 500)));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseDragged() {
  if (mouseButton === LEFT) {
    flock.push(new Boid(mouseX, mouseY));
    settings.boidCount++;
  }
}

function keyTyped() {
  switch (key) {
    case "a":
      settings.animate = !settings.animate;
      break;

    case "d":
      settings.showDiagnostics = !settings.showDiagnostics;
      break;

    case "o":
      settings.showObstacles = !settings.showObstacles;
      break;

    case "t":
      settings.showQuadTester = !settings.showQuadTester;
      break;

    case "q":
      settings.showQuadtree = !settings.showQuadtree;
      break;

    case "h":
      gui.closed ? gui.open() : gui.close();
      break;

    default:
      // Prevent default behavior
      return false;
  }
}

function keyPressed() {
  switch (keyCode) {
    case RIGHT_ARROW:
      if (settings.quadTreeSize < 1024)
        settings.quadTreeSize *= 2;
      break;

    case LEFT_ARROW:
      if (settings.quadTreeSize > 1)
        settings.quadTreeSize /= 2;
      break;

    case UP_ARROW:
      settings.boidCount += 50;
      initializeBoids();
      break;

    case DOWN_ARROW:
      if (settings.boidCount > 50) {
        settings.boidCount -= 50;
        initializeBoids();
      }
      break;
  }
}

// Main update loop
function draw() {
  updateControls();

  if (settings.showDiagnostics)
    drawDiagnostics();

  if (!settings.animate)
    return;

  // Fade background to black
  background(0, 20);

  let quadTree = createBoidQuadTree(flock);
  updateObstacles();

  if (settings.showQuadtree)
    quadTree.draw();

  if (settings.showObstacles)
    drawObstacles();

  for (let boid of flock) {
    boid.update(quadTree, obstacles);
    boid.draw();
  }

  if (settings.showQuadTester)
    drawQuadTester(quadTree);
}

function updateControls() {
  for (let i in gui.__controllers)
    gui.__controllers[i].updateDisplay();
}

function createBoidQuadTree(boids) {
  let qtBoundary = new Rectangle(windowWidth / 2, windowHeight / 2, windowWidth / 2, windowHeight / 2);
  let qt = new QuadTree(qtBoundary, settings.quadTreeSize);

  for (let boid of boids)
    qt.insert(boid.position.x, boid.position.y, boid);

  return qt;
}

function drawQuadTester(quadTree) {
  noFill();
  stroke(255);
  strokeWeight(1);
  circle(mouseX, mouseY, 200);

  strokeWeight(10);
  let searchArea = new CircleArea(mouseX, mouseY, 100);
  let matchedPoints = quadTree.query(searchArea);

  for (let match of matchedPoints) {
    point(match.x, match.y);
  }
}

function updateObstacles() {
  let rightMousePressed = mouseIsPressed && mouseButton === RIGHT;
  if (rightMousePressed) {
    obstacles[0].position.x = mouseX;
    obstacles[0].position.y = mouseY;
  }

  for (let obstacle of obstacles)
    obstacle.update();
}

function drawObstacles() {
  for (let obstacle of obstacles)
    obstacle.draw();
}

function drawDiagnostics() {
  // Clear background
  fill(0);
  stroke(0);
  rectMode(CORNER)
  rect(5, 5, 70, 20);

  textSize(12);
  fill(255);
  stroke(0);

  let fps = frameRate();
  text("FPS:  " + fps.toFixed(), 10, 20);
}