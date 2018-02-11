class Platform {

  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.rot = 0;
    this.polygon = new SAT.Polygon(new SAT.Vector(), [
      new SAT.Vector(x1, y1),
      new SAT.Vector(x2, y2)
    ]);
  }

  collision(other, response) {
    return SAT.testPolygonPolygon(this.polygon, other, response);
  }

  render(gl) {
    gl.moveTo(this.x1, this.y1);
    gl.lineTo(this.x2, this.y2);
  }

}
