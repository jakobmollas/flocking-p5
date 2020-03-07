'use strict'

const flock = [];
let animate = true;
let showFramerate = true;

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

  for (let boid of flock) {
    let rightMousePressed = mouseIsPressed && mouseButton === RIGHT;
    if (rightMousePressed)
      boid.setRepulsor(mouseX, mouseY);
    else 
      boid.clearRepulsor();
    
    boid.update(flock, );
    boid.draw();
  }
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