"use strict";

const Entity = require('./entity.js');
var SAT = require('sat');

class Platform {

  constructor(x1, y1, x2, y2){
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
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

  nonclimbable() {
    this.climbable = false;
    return this;
  }

};

module.exports = Platform;
