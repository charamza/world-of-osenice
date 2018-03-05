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
    this.legRot = 0;
    this.color = '#ff0000';
    this.teleporting = false;

    this.lastUpdatePacket = {
      s: 'u',
      e: {}
    };

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
    this.polygon.setOffset(new SAT.Vector(0, - this.py - 10 + this.height / 2));
    var collX = this.world.collision(this.polygon, -(this.px + mx) * Math.PI / 180);
    if (collX != null) {
      if (collX.climbable && this.falling >= 0) {
        this.py += collX.overlapV.y + 2;
      }
    } else {
      this.px += mx;
    }

    this.polygon.setOffset(new SAT.Vector(0, - this.py - my - 7 + this.height / 2));
    var collY = this.world.collision(this.polygon, -(this.px) * Math.PI / 180);
    if (collY != null) {
      if (collY.climbable) {
        this.py += collY.overlapV.y;
        this.falling = 0;
        this.standing = true;
        var legRot = Math.atan2(collY.overlapN.x, collY.overlapN.y);
        if (Math.abs(legRot) < Math.PI / 4) {
          this.legRot = legRot;
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
    data.color = this.color;
    data.mx = this.mx;
    data.my = this.my;
    data.tp = this.teleporting;
    return data;
  }

  receive(data){
    //console.log('received: %s', data);
    try {
      data = JSON.parse(data);
      var now = new Date().getTime();

      this.activity = now;

      if (data['s'] == 'l') {
        this.name = data['name'];
        if (data['color'] !== undefined) {
          var color = data['color'];
          if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color)) {
            this.color = color;
          }
        }
        var loginMessage = this.server.loginData(this);
        this.socket.send(JSON.stringify(loginMessage));
        this.loggedIn = true;
        console.log(this.server.getConsolePrefix() + 'Připojil se uživatel "' + this.name + '" (' + this.server.entities.length + ')');
      }
      if (data['s'] == 'u') {
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
          if (data['world'] == 'prepare') {
            this.teleporting = true;
          } else {
            var newworld = this.server.worlds[data['world']];
            if (newworld === undefined) return;
            this.changeWorld(newworld);
            this.sendUpdate(JSON.stringify(this.server.loginData(this)));
            this.teleporting = false;
          }
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
      console.log(this.server.getConsolePrefix(), "Poslal jsi data odpojene osobe...");
      this.server.removeEntity(this);
    }
  }

  jump() {
    this.falling = -700;
  }

}

module.exports = Player;
