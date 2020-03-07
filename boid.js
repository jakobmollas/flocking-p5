'use strict'

class Boid {
    constructor(x, y) {
        this.velocity = createVector(random(-1, 1), random(-1, 1));
        this.position = createVector(x, y);
        this.size = 3.0;
        this.maxSpeed = random(2, 7);
        this.maxSteeringForce = random(0.02, 0.40);
    }

    draw() {
        // Draw a triangle rotated in the direction of velocity
        let theta = this.velocity.heading() + radians(90);
        colorMode(HSB, 100);
        
        let normalizedHeading = (this.velocity.heading() + PI) / (2 * PI);
        let normalizedSpeed = this.velocity.mag() / this.maxSpeed;
        fill(100 * normalizedHeading, 50, 75 * normalizedSpeed);
        stroke(100 * normalizedHeading, 100, 100 * normalizedSpeed);
        
        push();
        translate(this.position.x, this.position.y);
        
        beginShape();
        vertex(0, -this.size * 2);
        vertex(-this.size, this.size * 2);
        vertex(this.size, this.size * 2);
        rotate(theta);
        endShape(CLOSE);
        
        pop();
    }

    update(boids) {
        let alignment = this.align(boids); 
        let separation = this.separate(boids);
        let cohesion = this.cohesion(boids);
        
        let acceleration = createVector();
        acceleration.add(alignment);
        acceleration.add(separation);
        acceleration.add(cohesion);

        this.velocity.add(acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);

        this.wraparoundIfNeeded();
    }

    wraparoundIfNeeded() {
        if (this.position.x < -this.size) this.position.x = width + this.size;
        if (this.position.y < -this.size) this.position.y = height + this.size;
        if (this.position.x > width + this.size) this.position.x = -this.size;
        if (this.position.y > height + this.size) this.position.y = -this.size;
    }

    align(boids) { 
        let perceptionRadius = 200;
        let steeringInfluence = createVector();
        let count = 0;

        for (let boid of boids) {
            if (boid == this) {
                continue;
            }

            let distance = p5.Vector.dist(this.position, boid.position)
            
            if (distance < perceptionRadius) {
                steeringInfluence.add(boid.velocity);
                count++;
            }
        }

        let steering = createVector();

        if (count > 0) {
            // Calculate average
            steeringInfluence.div(count); 
            steeringInfluence.normalize();
            // Scale
            steeringInfluence.mult(this.maxSpeed);
            // Calculate delta
            steering = p5.Vector.sub(steeringInfluence, this.velocity);
            // Limit steering to a max value (do not steer to quickly)
            steering.limit(this.maxSteeringForce);

            return steering;
        }

        return steering;
    }

    // Method checks for nearby boids and steers away
    separate(boids) {
        let perceptionRadius = 25.0;
        let steeringInfluence = createVector(0, 0);
        let count = 0;

        for (let boid of boids) {
            if (boid == this) {
                continue;
            }

            let distance = p5.Vector.dist(this.position, boid.position);
        
            if (distance > 0 && distance < perceptionRadius) {
                // Calculate vector pointing AWAY from neighbors
                let diff = p5.Vector.sub(this.position, boid.position);
                diff.normalize();
                diff.div(distance);        // Inversely scale with distance, farther away, less influence
                steeringInfluence.add(diff);
                count++;
            }
        }

        if (count > 0) {
            steeringInfluence.div(count);

            // Implement Reynolds: Steering = Desired - Velocity
            steeringInfluence.normalize();
            steeringInfluence.mult(this.maxSpeed);
            steeringInfluence.sub(this.velocity);
            steeringInfluence.limit(this.maxSteeringForce);
        }

        return steeringInfluence;
    }

    // For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
    cohesion(boids) {
        let perceptionRadius = 500;
        let sum = createVector(0, 0);   // Start with empty vector to accumulate all locations
        let count = 0;

        for (let boid of boids) {
            if (boid == this) {
                continue;
            }
            
            let distance = p5.Vector.dist(this.position, boid.position);
            if (distance < perceptionRadius) {
                sum.add(boid.position); // Add location
                count++;
            }
        }

        if (count > 0) {
            sum.div(count);

            let target = sum;
            let desired = p5.Vector.sub(target, this.position);  // A vector pointing from the location to the target
            // Normalize desired and scale to maximum speed
            desired.normalize();
            desired.mult(this.maxSpeed);
            // Steering = Desired minus Velocity
            let steer = p5.Vector.sub(desired, this.velocity);
            steer.limit(this.maxSteeringForce);  // Limit to maximum steering force

            return steer;
        } else {
            return createVector(0, 0);
        }
    }
}