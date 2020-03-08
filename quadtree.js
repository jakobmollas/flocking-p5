'use strict'

class Point {
    constructor(x, y, userData) {
        this.x = x;
        this.y = y;
        this.userData = userData;
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

class CircleArea {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.rSquared = this.r * this.r;
    }

    contains(x, y) {
        //Check if distance between point and center of circle is smaller that circle radius
        let distance = Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2);
        return distance <= this.rSquared;
    }

    intersects(rectangleArea) {
        var xDist = Math.abs(rectangleArea.x - this.x);
        var yDist = Math.abs(rectangleArea.y - this.y);

        var r = this.r;
        var w = rectangleArea.w;
        var h = rectangleArea.h;

        // no intersection
        if (xDist > r + w || yDist > r + h)
            return false;

        // intersection within the circle
        if (xDist <= w || yDist <= h)
            return true;

        var edges = Math.pow(xDist - w, 2) + Math.pow(yDist - h, 2);

        // intersection on the edge of the circle
        return edges <= this.rSquared;
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
        push();

        stroke(255);
        noFill();
        rectMode(RADIUS);
        strokeWeight(1);
        rect(this.boundary.x, this.boundary.y, this.boundary.w, this.boundary.h);
        if (this.isDivided) {
            this.northEast.draw();
            this.northWest.draw();
            this.southEast.draw();
            this.southWest.draw();
        }

        pop();
    }

    insert(x, y, userData) {
        if (!this.boundary.contains(x, y))
            return false;

        if (this.points.length < this.capacity) {
            this.points.push(new Point(x, y, userData));
            return true;
        }

        if (!this.isDivided) {
            this.subdivide();
            this.isDivided = true;
        }

        return this.northEast.insert(x, y, userData) ||
            this.northWest.insert(x, y, userData) ||
            this.southEast.insert(x, y, userData) ||
            this.southWest.insert(x, y, userData);
    }

    query(circleArea, matchedPoints) {
        if (!matchedPoints)
            matchedPoints = [];

        if (!this.isDivided && this.points.length === 0)
            return matchedPoints;

        if (!circleArea.intersects(this.boundary))
            return matchedPoints;

        for (let point of this.points) {
            if (circleArea.contains(point.x, point.y))
                matchedPoints.push(point);
        }

        if (this.isDivided) {
            this.northEast.query(circleArea, matchedPoints);
            this.northWest.query(circleArea, matchedPoints);
            this.southEast.query(circleArea, matchedPoints);
            this.southWest.query(circleArea, matchedPoints);
        }

        return matchedPoints;
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