class Chart {
    constructor(id, bounds) {
        this.id = id;
        this.bounds = bounds;

        this.element = document.getElementById(id);
        this.ctx = this.element.getContext("2d");

        this.series = [{
                color: "#f00",
                x_data: [],
                y_data: []
            },
            // {
            //     color: "#f0f",
            //     x_data: [0, 1, 2],
            //     y_data: [1, 1.2, 1]
            // }
        ];
    }

    dataToPixel(p, flip_xy = [false, true]) {
        return new Point(
            (flip_xy[0] ? (1 - ((p.x - this.bounds.minx) / (this.bounds.maxx - this.bounds.minx))) : (p.x - this.bounds.minx) / (this.bounds.maxx - this.bounds.minx)) * this.element.width,
            (flip_xy[1] ? (1 - ((p.y - this.bounds.miny) / (this.bounds.maxy - this.bounds.miny))) : (p.y - this.bounds.miny) / (this.bounds.maxy - this.bounds.miny)) * this.element.height
        );
    }

    addPointToSeries(idx, p) {
        this.series[idx].x_data.push(p.x);
        this.series[idx].y_data.push(p.y);
    }

    addTimeSeriesPoint(y, deltaTime) {
        this.bounds.minx += 1 / deltaTime;
        this.bounds.maxx += 1 / deltaTime;
        this.series[0].x_data = this.series[0].x_data.slice(-1000)
        this.series[0].y_data = this.series[0].y_data.slice(-1000)
        this.addPointToSeries(0, new Point(this.bounds.maxx, y));
    }

    render() {
        this.ctx.font = '13px monospace';
        this.ctx.textBaseline = 'middle';
        this.ctx.clearRect(0, 0, this.element.width, this.element.height);
        this.ctx.strokeStyle = "rgba(0,0,0,0.1)";
        for (var i = Math.round(this.bounds.minx); i < this.bounds.maxx; i++) {
            this.ctx.kDrawLine(this.dataToPixel(new Point(i, this.bounds.miny)), this.dataToPixel(new Point(i, this.bounds.maxy)));
            this.ctx.stroke();
        }
        for (var i = this.bounds.miny; i < this.bounds.maxy; i++) {
            var pos = this.dataToPixel(new Point(this.bounds.maxx, i));
            if (i == 0) {
                this.ctx.strokeStyle = "rgba(0,0,0,1)";
                this.ctx.fillText(i, 1, pos.y, );
            } else if (i % Math.ceil((this.bounds.maxy - this.bounds.miny) / 6) == 0) {
                this.ctx.strokeStyle = "rgba(0,0,0,.3)";
                this.ctx.fillText(i, 1, pos.y, );
            } else {
                this.ctx.strokeStyle = "rgba(0,0,0,0.1)";
            }
            this.ctx.kDrawLine(this.dataToPixel(new Point(this.bounds.minx, i)), pos);
            this.ctx.stroke();
        }
        this.ctx.lineWidth = 2;
        for (var i = 0; i < this.series.length; i++) {
            var pr = this.dataToPixel(new Point(this.series[i].x_data[0], this.series[i].y_data[0]));
            this.ctx.strokeStyle = this.series[i].color;
            for (var xi = 1; xi < this.series[i].x_data.length; xi++) {
                var p = this.dataToPixel(new Point(this.series[i].x_data[xi], this.series[i].y_data[xi]));
                this.ctx.kDrawLine(pr, p);
                this.ctx.stroke();
                pr = p;
            }
        }
        this.ctx.lineWidth = 1;
    }
}