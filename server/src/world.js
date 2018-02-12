"use strict";

var WebSocket = require('ws');
var fs = require('fs');
const User = require('./player.js');
var SAT = require('sat');


class World {

  constructor(server, name){
    this.server = server;
    this.name = name;

    this.platforms = [];
    this.entites = [];
  }

  load() {

  }

  update() {
    /*for (var entity of this.entities) {
      entity.update();
    }*/
  }

};

module.exports = World;
