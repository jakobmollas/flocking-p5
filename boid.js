'use strict'

class Boid {
    constructor() {
        this.position = createVector(random(width), random(height));
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(0.5, 1.5));
        this.acceleration = createVector();
    }

    show() {
        strokeWeight(8);
        stroke(255);
        point(this.position.x, this.position.y);
    }

    update(boids) {
        let alignment = this.align(boids); 
        this.acceleration = alignment;

        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
    }

    align(boids) { 
        let perceptionRadius = 50;
        let total = 0;
        
        let steering = createVector();
        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);

            if (this != other && d < perceptionRadius) {
                steering.add(other.velocity);
                total++;
            }
        }

        if (total > 0) {
            steering.div(total); 
            steering.sub(this.velocity);
        }

        return steering;
    }
}