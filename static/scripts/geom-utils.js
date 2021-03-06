class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static fromArray(arr) { return new Point(arr[0], arr[1]); }

    static dot(a, b) { return a.x * b.x + a.y * b.y; }
    dot(b) { return Point.dot(this, b); }

    static det(a, b) { return a.x * b.y - a.y * b.x; }
    det(b) { return Point.det(this, b); }

    static sub(a, b) { return new Point(a.x - b.x, a.y - b.y); }
    sub(b) { return Point.sub(this, b); }

    static mul(a, b) { return new Point(a.x * b, a.y * b); }
    mul(b) { return Point.mul(this, b); }

    static mulXY(a, b) { return new Point(a.x / b.x, a.y / b.y); }
    mulXY(b) { return Point.mulXY(this, b); }

    static add(a, b) { return new Point(a.x + b.x, a.y + b.y); }
    add(b) { return Point.add(this, b); }

    static div(a, b) { return new Point(a.x / b, a.y / b); }
    div(b) { return Point.div(this, b); }

    static divXY(a, b) { return new Point(a.x / b.x, a.y / b.y); }
    divXY(b) { return new Point(this.x / b.x, this.y / b.y); }

    static pow(a, b) { return new Point(Math.pow(a.x, b), Math.pow(a.y, b)); }
    pow(b) { return Point.pow(this, b); }

    static dist(a, b) { return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)); }
    dist(b) { return Point.dist(this, b); }

    static lerp(a, b, t) { return new Point(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t); }
    lerpTo(b, t) { return new Point(this.x + (b.x - this.x) * t, this.y + (b.y - this.y) * t); }

    static cross(a, b) { return (a.x * b.y) - (a.y * b.x); }
    cross(b) { return Point.cross(this, b); }

    static angleTo(a, b) { return Point.getAngle(a) - Point.getAngle(b); }
    angleTo(b) { return Point.angleTo(this, b); }

    static fromAngle(a) { return new Point(Math.cos(a), Math.sin(a)); }

    static linePointProjection(lineCrossPoint, slope, pointToProject) {
        let perpendicular = slope;
        return new Point(pointToProject.x, perpendicular * (pointToProject.x - lineCrossPoint.x) + lineCrossPoint.y);
    }

    static get3PointCircle(a, b, c) {
        var x12 = (a.x - b.x);
        var x13 = (a.x - c.x);

        var y12 = (a.y - b.y);
        var y13 = (a.y - c.y);

        var y31 = (c.y - a.y);
        var y21 = (b.y - a.y);

        var x31 = (c.x - a.x);
        var x21 = (b.x - a.x);

        //x1^2 - x3^2
        var sx13 = Math.pow(a.x, 2) - Math.pow(c.x, 2);

        // y1^2 - y3^2
        var sy13 = Math.pow(a.y, 2) - Math.pow(c.y, 2);

        var sx21 = Math.pow(b.x, 2) - Math.pow(a.x, 2);
        var sy21 = Math.pow(b.y, 2) - Math.pow(a.y, 2);

        var f = ((sx13) * (x12) +
                (sy13) * (x12) +
                (sx21) * (x13) +
                (sy21) * (x13)) /
            (2 * ((y31) * (x12) - (y21) * (x13)));
        var g = ((sx13) * (y12) +
                (sy13) * (y12) +
                (sx21) * (y13) +
                (sy21) * (y13)) /
            (2 * ((x31) * (y12) - (x21) * (y13)));

        var c = -(Math.pow(a.x, 2)) -
            Math.pow(a.y, 2) - 2 * g * a.x - 2 * f * a.y;

        var h = -g;
        var k = -f;
        var sqr_of_r = h * h + k * k - c;

        // r is the radius
        var r = Math.sqrt(sqr_of_r);
        return {
            x: h,
            y: k,
            r: r
        }
    }

    static get2PointRadCenter(a, b, r) {
        // if (2 * r < Point.dist(a, b))
        //     return [Point.div(Point.add(a, b), 2),  Point.div(Point.add(a, b), 2)]
        let radsq = r * r;
        let x1 = a.x;
        let y1 = a.y;
        let x2 = b.x;
        let y2 = b.y;

        let q = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
        let x3 = (x1 + x2) / 2;
        let rx = Math.sqrt(radsq - ((q / 2) * (q / 2))) * ((y1 - y2) / q);

        let y3 = (y1 + y2) / 2;
        let ry = Math.sqrt(radsq - ((q / 2) * (q / 2))) * ((x2 - x1) / q);
        let offset = new Point(rx, ry)
        return [Point.add(new Point(x3, y3), offset), Point.sub(new Point(x3, y3), offset)];
    }


    sideOfLine(a, b) { return Math.sign((b.x - a.x) * (this.y - a.y) - (b.y - a.y) * (this.x - a.x)) }

    normalize() { let len = this.len(); return new Point(this.x / len, this.y / len); }

    len() { return Math.sqrt(this.x * this.x + this.y * this.y); }

    rotate(angle) {
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        return new Point(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
    }

    mirror(o, p) {
        let d = Point.sub(o, p);
        this.x = -d.x + o.x;
        this.y = -d.y + o.y;
    }

    equals(other) { return this.x == other.x && this.y == other.y; }

    getAngle() { return Math.atan2(this.y, this.x); }

    asArray() { return [this.x, this.y]; }
}

class Line {
    constructor(slope, intercept) {
        this.slope = slope;
        this.intercept = intercept;
    }

    static fromPoints(a, b) {
        let slope = (b.y - a.y) / (b.x - a.x);
        let intercept = a.y - slope * a.x;
        return new Line(slope, intercept);
    }

    static fromPointSlope(p, slope) {
        return new Line(slope, p.y - slope * p.x);
    }

    getPoint(x) {
        return new Point(x, this.slope * x + this.intercept);
    }

    static perpendicularBisector(a, b) {
        let p = a.lerpTo(b, 0.5);
        let s = -(b.x - a.x) / (b.y - a.y);
        return new Line(s, p.y - s * p.x);
        // return Line.fromPointSlope(p, -1 / s);
    }

    getIntersection(other) {
        let x = (other.intercept - this.intercept) / (this.slope - other.slope);
        let y = this.slope * x + this.intercept;
        return new Point(x, y);
    }
}

class Polygon {
    constructor(points) {
        // sort points by angle to center
        this.points = points;
        let c = this.getCenter();
        this.points = points.sort((a, b) => {
            let aa = Math.atan2(a.y - c.y, a.x - c.x);
            let bb = Math.atan2(b.y - c.y, b.x - c.x);
            return aa - bb;
        });
        this.points = points;
    }

    getCenter() {
        let x = 0;
        let y = 0;
        for (let i = 0; i < this.points.length; i++) {
            x += this.points[i].x;
            y += this.points[i].y;
        }
        return new Point(x / this.points.length, y / this.points.length);
    }

    convexHull() {
        let points = this.points;
        let endpoint = points[0]
        points.sort(function(a, b) {
            return a.x - b.x
        });
        let pointOnHull = points[0];
        let hull = []

        while (true) {
            hull.push(pointOnHull);
            let x = 0
            for (let i = 0; i < points.length; i++) {
                let point = points[i]
                let position = (endpoint.x - pointOnHull.x) * (point.y - pointOnHull.y) - (endpoint.y - pointOnHull.y) * (point.x - pointOnHull.x)
                if ((endpoint.equals(pointOnHull)) || (position > 0.0001)) {
                    endpoint = point
                    x += 1
                }
            }
            pointOnHull = endpoint;
            if (endpoint == hull[0]) break
        }
        return hull
    }

    pointInside(p) {
        let sides = this.points.map((x, i) => {
            return p.sideOfLine(this.points[i], this.points[(i + 1) % this.points.length]);
        });

        return sides.every(x => x == sides[0]);
    }
    pointInsideOffset(p, offset) {
        return new Polygon(this.getOffsetPoints(offset)).pointInside(p);
    }

    getBoundingBox() {
        let minX = this.points[0].x;
        let minY = this.points[0].y;
        let maxX = this.points[0].x;
        let maxY = this.points[0].y;
        for (let i = 1; i < this.points.length; i++) {
            if (this.points[i].x < minX) minX = this.points[i].x;
            if (this.points[i].y < minY) minY = this.points[i].y;
            if (this.points[i].x > maxX) maxX = this.points[i].x;
            if (this.points[i].y > maxY) maxY = this.points[i].y;
        }
        return {
            minX: minX,
            minY: minY,
            maxX: maxX,
            maxY: maxY
        };
    }
    leftPerp(p) { return new Point(p.y, -p.x); }
    rightPerp(p) { return new Point(-p.y, p.x); }

    rayIntersectsSegment(rayOrigin, rayDirection, a, b, tmax) {
        let seg = Point.sub(b, a);
        let segPerp = this.leftPerp(seg);
        let perpDotd = Point.dot(rayDirection, segPerp);
        if (Math.abs(perpDotd) < 0.001) {
            return {
                hit: false,
                t: Infinity
            };
        }

        let d = Point.sub(a, rayOrigin);
        let t = Point.dot(segPerp, d) / perpDotd;
        let s = Point.dot(this.leftPerp(rayDirection), d) / perpDotd;

        return {
            hit: t >= 0.0 && t <= tmax && s >= 0.0 && s <= 1.0,
            t: t
        }
    }
    lineCast(a, b) {
        let rayOrigin = a;
        let rayDirection = Point.sub(b, a).normalize();
        let maxDist = Point.dist(b, a);

        if (this.pointInside(a) || this.pointInside(b)) return true;
        for (let j = 1; j < this.points.length; j++) {
            let h = this.rayIntersectsSegment(
                rayOrigin,
                rayDirection.normalize(),
                this.points[(j - 1) % this.points.length],
                this.points[j],
                maxDist
            ).hit;
            if (h) {
                return true;
            }
        }
        return false;
    }


    segmentIntersection(a, b, c, d) {
        let u = Point.sub(b, a);
        let v = Point.sub(d, c);
        let w = Point.sub(a, c);
        let D = Point.cross(u, v);
        let s = Point.cross(v, w) / D;
        let t = Point.cross(w, u) / D;
        return s >= 0 && s <= 1 && t >= 0 && t <= 1;
    }

    getOffsetPoints(offset) {
        let points = [];

        for (let i = 0; i < this.points.length; i++) {
            let prev = (i + this.points.length - 1) % this.points.length;
            let next = (i + this.points.length + 1) % this.points.length;
            let flip = Point.dot(
                this.rightPerp(Point.sub(this.points[i], this.points[next])),
                Point.sub(this.points[prev], this.points[i]),
            ) < 0 ? 1 : -1;
            let lineNormal = this.rightPerp(Point.sub(this.points[prev], this.points[i]).normalize())
            let a = Point.add(this.points[i], Point.mul(lineNormal, offset * flip));
            let b = Point.add(this.points[prev], Point.mul(lineNormal, offset * flip));

            points.push(a);
            points.push(b);
        }
        let c = this.getCenter();
        points = points.sort((a, b) => {
            let aa = Math.atan2(a.y - c.y, a.x - c.x);
            let bb = Math.atan2(b.y - c.y, b.x - c.x);
            return aa - bb;
        });

        let len = points.length;
        for (let i = 0; i < len - 1; i += 2) {
            points.push(Point.add(Point.mul(Point.sub(Point.lerp(points[i], points[(i + 1) % points.length], .5), this.points[i / 2]).normalize(), offset), this.points[i / 2]));
        }
        return points;
    }

    perimeter() {
        let perimeter = 0;
        for (let i = 0; i < this.points.length; i++) {
            let prev = (i + this.points.length - 1) % this.points.length;
            perimeter += Point.dist(this.points[i], this.points[prev]);
        }
        return perimeter;
    }
}

class CubicHermite {
    constructor(points, tangents) {
        this.points = points;
        this.tangents = tangents;
    }

    interpolate(t, derivative) {
        var n = this.points.length; // number or points / tangents / knots
        var d = this.points[0].length; // dimension
        var v = new Array(d); // destination vector

        var t = t * (n - 1); // rescale t to [0, n-1]
        var i0 = t | 0; // truncate
        var i1 = i0 + 1;

        if (i0 > n - 1) throw new Error('out of bounds');
        if (i0 === n - 1) i1 = i0;

        var scale = i1 - i0;

        t = (t - i0) / scale;

        if (derivative) {
            var t2 = t * t;
            var h00 = 6 * t2 - 6 * t;
            var h10 = 3 * t2 - 4 * t + 1;
            var h01 = -6 * t2 + 6 * t;
            var h11 = 3 * t2 - 2 * t;
        } else {
            var t2 = t * t;
            var it = 1 - t;
            var it2 = it * it;
            var tt = 2 * t;
            var h00 = (1 + tt) * it2;
            var h10 = t * it2;
            var h01 = t2 * (3 - tt);
            var h11 = t2 * (t - 1);
        }

        for (var i = 0; i < d; i++) {
            v[i] = h00 * this.points[i0][i] +
                h10 * this.tangents[i0][i] * scale +
                h01 * this.points[i1][i] +
                h11 * this.tangents[i1][i] * scale;
        }
        return v;
    }
}