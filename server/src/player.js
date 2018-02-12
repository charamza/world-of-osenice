"use strict";

var Entity = require('./entity.js');
var SAT = require('sat');

class Player extends Entity {

  constructor(server, socket) {
    super(server, 'p');
    this.socket = socket;
    this.activity = new Date().getTime();

    this.mx = 0.5;
    this.my = 0.5;

    this.speed = 4.0;
    this.width = 32;
    this.height = 32;

    socket.on('message', (data) => this.receive(data));
  }

  isActive(){
    var now = new Date().getTime();
    return (this.activity > now - 15000);
  }

  update(){

  }

  getData() {
    var data = super.getData();
    data.mx = this.mx;
    data.my = this.my;
    return data;
  }

  receive(data){
    console.log('received: %s', data);
    try {
      data = JSON.parse(data);
      var now = new Date().getTime();

      this.activity = now;

      if (data['state'] == 'login') {
        this.name = data['name'];
        var loginMessage = this.server.loginData(this);
        this.socket.send(JSON.stringify(loginMessage));
        console.log(this.server.getConsolePrefix() + 'Připojil se uživatel "' + this.name + '" (' + this.server.entities.length + ')');
      }
      if (data['state'] == 'update') {
        this.updateVariable('dx', data);
        this.updateVariable('mx', data);
        this.updateVariable('my', data);
        //this.updateVariable('my', data);
      }
    } catch (e) {
      console.log(this.server.getConsolePrefix() + 'Player Update: ', e);
    }
  }

  updateVariable(key, data){
    try {
      if (typeof data[key] !== 'undefined') {
        this[key] = new Number(data[key]);
      }
    } catch (e) {
      console.log(this.server.getConsolePrefix() + 'Player Update Variable: ', e);
    }
  }

  sendUpdate(data){
    try {
      this.socket.send(data);
    } catch (e) {
      console.log(this.server.getConsolePrefix(), e);
      this.server.removeUser(this);
    }
  }

}

module.exports = Player;
