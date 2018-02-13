"use strict";

const World = require('./world.js');
const Entity = require('./entity.js');
const Player = require('./player.js');

class GameServer {

  constructor(){
    this.entities = [];
    this.ai = 0;

    this.world = new World(this, 'one');

    this.size = 800;

    this.STEPS = 0;

    this.setup();
  }

  setup(){

  }

  addEntity(entity){
    this.entities.push(entity);
  }

  removeEntity(entity){
    this.entities.splice(this.entities.indexOf(entity), 1);
  }

  getEntity(id) {
    var entity = null;
    this.entities.forEach((item) => {
      if (item.id == id) {
        entity = item;
        return false;
      }
    });
    return entity;
  }

  loginData(player){
    var data = {
      state: 'login',
      motd: 'Vítej ve hře!',
      name: player.name,
      id: player.id,
      px: player.px,
      py: player.py,
    };

    return data;
  }

  updateData(){
    var timestamp = new Date().getTime();
    var data = {
      state: 'update',
      t: timestamp,
      e: {}
    };

    var length = 0;

    this.entities.forEach((player) => {
      var playerData = player.getData();
      if (playerData != null) {
        data.e[player.id] = playerData;
        length++;
      }
    });

    return (length > 0 ? data : null);
  }

  getConsolePrefix() {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec + " [INFO] ";
  }

}

module.exports = GameServer;
