var express = require('express');
var app = express();
var http = require('http').createServer(app);
const GameServer = require('./server.js');
const Player = require('./player.js');
const World = require('./world.js');

var WebSocket = require('ws');
var wss = new WebSocket.Server({ port: 6060 });

var server = new GameServer();

wss.on('connection', (socket) => {
  var player = new Player(server, socket);
  server.addEntity(player);

  socket.on('close', (data) => {
    server.removeEntity(player);
    console.log(server.getConsolePrefix() + 'Odpojil se uživatel "' + player.name + '" (' + server.entities.length + ')');
  });
});

setInterval(() => {
  server.entities.forEach((entity) => {
    if (entity.update) entity.update();
  });
  server.world.update();

  if (server.STEPS % 2 == 0) {
    var data = server.updateData();
    if (data != null) {
      data = JSON.stringify(data);
      server.entities.forEach((player) => {
        if (player instanceof Player) {
          player.sendUpdate(data);
        }
      });
    }
  }

  server.STEPS++;
}, 16);
