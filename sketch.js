//@ts-check

const flock = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  for(let i = 0; i < 250; i++)  {
    flock.push(new Boid(random(windowWidth), random(windowHeight)));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Add a new boid into the System
function mouseDragged() {
  flock.push(new Boid(mouseX, mouseY));
}

function draw() {
  background(0, 20);

  for (let boid of flock) {
    boid.update(flock);
    boid.draw();
  }
}