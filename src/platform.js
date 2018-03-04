class Platform {

  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.bounds = {
      x1: (x1 < x2 ? x1 : x2),
      y1: (y1 < y2 ? y1 : y2),
      x2: (x1 > x2 ? x1 : x2),
      y2: (y1 > y2 ? y1 : y2),
    };
    this.climbable = true;
    this.polygon = new SAT.Polygon(new SAT.Vector(), [
      new SAT.Vector(x1, y1),
      new SAT.Vector(x2, y2)
    ]);
  }

  collision(other, response, rot) {
    response.climbable = this.climbable;
    this.polygon.setAngle(rot);
    return SAT.testPolygonPolygon(other, this.polygon, response);
  }

  inBounds(bounds) {
    return (this.bounds.x1 < bounds.x2 && bounds.x1 < this.bounds.x2 && this.bounds.y1 < bounds.y2 && bounds.y1 < this.bounds.y2);
  }

  render(gl) {
    gl.moveTo(this.x1, this.y1);
    gl.lineTo(this.x2, this.y2);
  }

  nonclimbable() {
    this.climbable = false;
    return this;
  }

}
