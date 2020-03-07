'use strict'

let flock = [];
let obstacles = [];
let animate = true;
let showDiagnostics = true;
let showQuadtree = false;
let showQuadTester = false;
let showObstacles = false;
let quadTreeSize = 32;
let boidCount = 250;

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('display', 'block');

  textFont('monospace');

  initializeBoids();
  initializeObstacles();
}

function initializeBoids() {
  flock = [];
  
  for(let i = 0; i < boidCount; i++)  {
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
    boidCount++;
  }
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

    case "o": 
      showObstacles = !showObstacles;
      break;

    case "t": 
      showQuadTester = !showQuadTester;
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

// Main update loop
function draw() {
  if (showDiagnostics)
    drawDiagnostics();

  if (!animate)
    return;

  // Fade background to black
  background(0, 20);

  let quadTree = createBoidQuadTree(flock);
  updateObstacles();

  if (showQuadtree)
    quadTree.draw();

  if (showObstacles)
    drawObstacles();
  
  for (let boid of flock) {
    boid.update(quadTree, obstacles);
    boid.draw();
  }

  if (showQuadTester) 
    drawQuadTester(quadTree);
}

function createBoidQuadTree(boids) {
  let qtBoundary = new Rectangle(windowWidth / 2, windowHeight / 2, windowWidth / 2, windowHeight / 2);
  let qt = new QuadTree(qtBoundary, quadTreeSize);

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
  rect(5, 5, 100, 60);
  
  textSize(12);
  fill(255);
  stroke(0);

  let fps = frameRate();
  text("FPS:     " + fps.toFixed(), 10, 20);
  text("Boids:   " + flock.length, 10, 40)
  text("QT Size: " + quadTreeSize, 10, 60)
}