'use strict'

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w; // width to bounds, not full width
        this.h = h; // height to bounds, not full height
    }

    contains(x, y) {
        return (x >= this.x - this.w && 
            x <= this.x + this.w && 
            y >= this.y - this.h && 
            y <= this.y + this.h);
    }
}

class QuadTree {
    constructor(boundary, capacity) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
        this.isDivided = false;

        this.northEast = null;
        this.northWest = null;
        this.southEast = null;
        this.southWest = null;
    }

    draw() {
        stroke(255);
        noFill();
        rectMode(CENTER);
        rect(this.boundary.x, this.boundary.y, this.boundary.w * 2, this.boundary.h * 2);
        if (this.isDivided) {
            this.northEast.draw();
            this.northWest.draw();
            this.southEast.draw();
            this.southWest.draw();
        }
    }

    insert(x, y) {
        if (!this.boundary.contains(x, y))
            return false;

        if (this.points.length < this.capacity) {
            this.points.push(new Point(x, y));
            return true;
        }

        if (!this.isDivided) {
            this.subdivide();
            this.isDivided = true;
        }

        return this.northEast.insert(x, y) || 
            this.northWest.insert(x, y) || 
            this.southEast.insert(x, y) || 
            this.southWest.insert(x, y);
    }

    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let halfWidth = this.boundary.w / 2;
        let halfHeight = this.boundary.h / 2;

        let ne = new Rectangle(x + halfWidth, y - halfHeight, halfWidth, halfHeight);
        this.northEast = new QuadTree(ne, this.capacity);
        let nw = new Rectangle(x - halfWidth, y - halfHeight, halfWidth, halfHeight);
        this.northWest = new QuadTree(nw, this.capacity);
        let se = new Rectangle(x + halfWidth, y + halfHeight, halfWidth, halfHeight);
        this.southEast = new QuadTree(se, this.capacity);
        let sw = new Rectangle(x - halfWidth, y + halfHeight, halfWidth, halfHeight);
        this.southWest = new QuadTree(sw, this.capacity);
    }
}