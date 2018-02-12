"use strict";

var WebSocket = require('ws');
var SAT = require('sat');

class Entity {

  constructor(server, type){
    this.server = server;

    this.px = 0;
    this.py = server.size + 200;

    this.dx = 0;

    this.width = 20;
    this.height = 20;
    this.speed = 1;

    this.onetime = {};

    this.id = server.ai++;
    this.name = '';
  }

  getData() {
    var data = Object.assign({
      px: this.px,
      py: this.py,
      dx: this.dx
    }, this.onetime);
    this.onetime = {};
    return data;
  }

};

module.exports = Entity;
