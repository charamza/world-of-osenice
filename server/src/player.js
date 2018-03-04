"use strict";

var Entity = require('./entity.js');
var SAT = require('sat');

class Player extends Entity {

  constructor(server, world, socket) {
    super(server, world, 'p', 32, 32);
    this.socket = socket;
    this.activity = new Date().getTime();

    this.mx = 0.5;
    this.my = 0.5;
    this.rot = 0;

    this.speed = 4.0;

    this.loggedIn = false;

    this.standing = false;
    this.falling = 0;
    this.color = 'rgba(255, 0, 0)';

    socket.on('message', (data) => this.receive(data));
  }

  isActive(){
    var now = new Date().getTime();
    return (this.activity > now - 15000);
  }

  update(){
    this.falling += 16;
    var vFalling = this.falling / 100;
    var colliding = false;

    var mx = this.dx * 400 / this.world.radius;
    var my = -vFalling;

    this.polygon.setAngle(0);
    this.polygon.setOffset(new SAT.Vector(0, - this.py - 10));
    var collX = this.world.collision(this.polygon, -(this.px + mx - 1.4) * Math.PI / 180);
    this.polygon.setOffset(new SAT.Vector(0, - this.py - my - 7));
    var collY = this.world.collision(this.polygon, -(this.px - 1.4) * Math.PI / 180);
    if (collX != null) {
      if (collX.climbable && this.falling >= 0) {
        this.py += collX.overlapV.y;
      }
    } else {
      this.px += mx;
    }

    if (collY != null) {
      if (collY.climbable) {
        this.py += collY.overlapV.y;
        this.falling = 0;
        this.standing = true;
      } else {
        if (this.falling > 0) {
          this.px -= collY.overlapV.x;
        } else {
          this.falling = 0;
        }
      }
    } else {
      this.py += my;
      this.standing = false;
    }
  }

  getData() {
    var data = super.getData();
    data.name = this.name;
    data.mx = this.mx;
    data.my = this.my;
    return data;
  }

  receive(data){
    //console.log('received: %s', data);
    try {
      data = JSON.parse(data);
      var now = new Date().getTime();

      this.activity = now;

      if (data['state'] == 'login') {
        this.name = data['name'];
        var loginMessage = this.server.loginData(this);
        this.socket.send(JSON.stringify(loginMessage));
        this.loggedIn = true;
        console.log(this.server.getConsolePrefix() + 'Připojil se uživatel "' + this.name + '" (' + this.server.entities.length + ')');
      }
      if (data['state'] == 'update') {
        this.updateVariable('dx', data);
        this.updateVariable('mx', data);
        this.updateVariable('my', data);
        if (data['jump'] !== undefined) {
          this.jump();
          this.onetime['jump'] = 0;
        }
        if (data['message'] !== undefined) {
          var message = data['message'];
          console.log(this.server.getConsolePrefix() + this.name + ': ' + message);
          this.onetime['message'] = message;
        }
        if (data['world'] !== undefined) {
          var newworld = this.server.worlds[data['world']];
          if (newworld === undefined) return;
          this.changeWorld(newworld);
          this.sendUpdate(JSON.stringify(this.server.loginData(this)));
        }
      }
    } catch (e) {
      console.log(this.server.getConsolePrefix() + 'Player Update:', e);
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
      this.server.removeEntity(this);
    }
  }

  jump() {
    this.falling = -700;
  }

}

module.exports = Player;
