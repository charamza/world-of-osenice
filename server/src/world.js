"use strict";

var WebSocket = require('ws');
var fs = require('fs');
const Player = require('./player.js');
const Platform = require('./platform.js');
var SAT = require('sat');


class World {

  constructor(server, name){
    this.server = server;
    this.name = name;

    this.setup();
  }

  setup() {
    this.platforms = [];
    this.entities = [];

    var iterations = 80;
    var gap = 360 / iterations;
    var distance = 800;
    var cx = 0;
    var cy = 0;

    var noisemap = [];
    //noise.seed(Math.random());

    for (var i = 0; i < iterations + 1; i++) {
      noisemap[i] = 0;//noise.simplex2(i, 0) * 20;
    }

    for (var i = 0; i < iterations - 2; i++) {
      var a1 = i * gap * Math.PI / 180;
      var a2 = (i + 1) * gap * Math.PI / 180;
      var x1 = Math.sin(a1) * (distance + noisemap[i]) + cx;
      var y1 = Math.cos(a1) * (distance + noisemap[i]) + cy;
      var x2 = Math.sin(a2) * (distance + noisemap[i + 1]) + cx;
      var y2 = Math.cos(a2) * (distance + noisemap[i + 1]) + cy;
      this.platforms.push(new Platform(x1, y1, x2, y2));
    }
    this.platforms.push(new Platform(
      Math.sin(78 * gap * Math.PI / 180) * (distance + noisemap[78]),
      Math.cos(78 * gap * Math.PI / 180) * (distance + noisemap[78]),
      Math.sin(78 * gap * Math.PI / 180) * (distance + noisemap[78]) / 6 * 5,
      Math.cos(78 * gap * Math.PI / 180) * (distance + noisemap[78]) / 6 * 5
    ).nonclimbable());
    this.platforms.push(new Platform(
      Math.sin(80 * gap * Math.PI / 180) * (distance + noisemap[0]),
      Math.cos(80 * gap * Math.PI / 180) * (distance + noisemap[0]),
      Math.sin(80 * gap * Math.PI / 180) * (distance + noisemap[0]) / 6 * 4,
      Math.cos(80 * gap * Math.PI / 180) * (distance + noisemap[0]) / 6 * 4
    ).nonclimbable());
    this.platforms.push(new Platform(
      Math.sin(78 * gap * Math.PI / 180) * (distance + noisemap[78]) / 6 * 5,
      Math.cos(78 * gap * Math.PI / 180) * (distance + noisemap[78]) / 6 * 5,
      Math.sin(70 * gap * Math.PI / 180) * (distance + noisemap[70]) / 6 * 5,
      Math.cos(70 * gap * Math.PI / 180) * (distance + noisemap[70]) / 6 * 5
    ));
    this.platforms.push(new Platform(
      Math.sin(80 * gap * Math.PI / 180) * (distance + noisemap[0]) / 6 * 4,
      Math.cos(80 * gap * Math.PI / 180) * (distance + noisemap[0]) / 6 * 4,
      Math.sin(70 * gap * Math.PI / 180) * (distance + noisemap[70]) / 6 * 4,
      Math.cos(70 * gap * Math.PI / 180) * (distance + noisemap[70]) / 6 * 4
    ));
    this.platforms.push(new Platform(
      Math.sin(70 * gap * Math.PI / 180) * (distance + noisemap[70]) / 6 * 5,
      Math.cos(70 * gap * Math.PI / 180) * (distance + noisemap[70]) / 6 * 5,
      Math.sin(70 * gap * Math.PI / 180) * (distance + noisemap[70]) / 6 * 4,
      Math.cos(70 * gap * Math.PI / 180) * (distance + noisemap[70]) / 6 * 4
    ));
  }

  update() {
    /*for (var entity of this.entities) {
      entity.update();
    }*/
  }

  collision(other, rot) {
    var response = new SAT.Response();
    for (var i = 0; i < this.platforms.length; i++) {
      if (this.platforms[i].collision(other, response, rot)) {
        return response;
      }
    }
    return null;
  }

  collisionEntities(entity) {
    var entities = [];
    entity.updateBoundsPolygon();
    for (var i = 0; i < this.entities.length; i++) {
      if (this.entities[i] == entity) continue;
      if (this.entities[i].collision(entity)) {
        entities.push(this.entities[i]);
      }
    }
    return entities;
  }

  addEntity(entity) {
    this.entities.push(entity);
  }

  removeEntity(entity) {
    var index = this.entities.indexOf(entity);
    if (index == -1) return;
    this.entities.splice(index, 1);
  }

};

module.exports = World;
