'use strict'

class Obstacle {
    constructor(x, y, radius) {
        this.velocity = createVector(random(-3, 3), random(-3, 3));
        this.position = createVector(x, y);
        this.radius = radius;
    }

    update() {
        this.position.add(this.velocity);
        this.wraparoundIfNeeded();
    }

    draw() {
        push();
        noFill();
        stroke(255);
        strokeWeight(1);
        circle(this.position.x, this.position.y, this.radius * 2);
        pop();
    }

    wraparoundIfNeeded() {
        if (this.position.x < -this.radius)
            this.position.x = width + this.radius;
        else if (this.position.x > width + this.radius)
            this.position.x = -this.radius;

        if (this.position.y < -this.radius)
            this.position.y = height + this.radius;
        else if (this.position.y > height + this.radius)
            this.position.y = -this.radius;
    }
}