"use strict";

var WebSocket = require('ws');
var fs = require('fs');
const Player = require('./player.js');
const Platform = require('./platform.js');
var SAT = require('sat');


class World {

  constructor(server, filename){
    this.server = server;
    this.filename = filename;
    this.name = '';
    this.radius = 0;

    this.setup();
  }

  setup() {
    this.platforms = [];
    this.entities = [];

    var data = JSON.parse(fs.readFileSync( __dirname + '/../../worlds/' + this.filename + '.json'));

    this.radius = data['tilewidth'];
    this.name = data['layers'][0]['name'];
    var points = data['layers'][0]['objects'];

    for (var i = 0; i < points.length; i++) {
      var rot = (points[i].rotation != undefined ? points[i].rotation * Math.PI / 180 : 0);
      var x1 = points[i].polyline[0]['x'] * Math.cos(rot) + points[i].polyline[0]['y'] * Math.sin(rot) - this.radius + points[i].x;
      var y1 = points[i].polyline[0]['y'] * Math.cos(rot) + points[i].polyline[0]['x'] * Math.sin(rot) - this.radius + points[i].y;
      var x2 = points[i].polyline[1]['x'] * Math.cos(rot) + points[i].polyline[1]['y'] * Math.sin(rot) - this.radius + points[i].x;
      var y2 = points[i].polyline[1]['y'] * Math.cos(rot) + points[i].polyline[1]['x'] * Math.sin(rot) - this.radius + points[i].y;

      var platform = new Platform(x1, y1, x2, y2);

      if (points[i].properties != undefined) {
        if (points[i].properties.climbable != undefined) platform.climbable = points[i].properties.climbable;
      }

      this.platforms.push(platform);
    }
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
