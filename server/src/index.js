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
  var player = new Player(server, server.worlds.roumen, socket);
  server.addEntity(player);

  socket.on('error', (e) => {
    console.log(server.getConsolePrefix() + 'Vyskytla se chyba :(');
  });
  socket.on('close', (data) => {
    server.removeEntity(player);
    console.log(server.getConsolePrefix() + 'Odpojil se uživatel "' + player.name + '" (' + server.entities.length + ')');
  });
});

setInterval(() => {
  server.entities.forEach((entity) => {
    if (entity.update) entity.update();
  });
  Object.keys(server.worlds).forEach((key) => {
    server.worlds[key].update();
  });

  if (server.STEPS % 3 == 0) {
    server.entities.forEach((player) => {
      var data = JSON.stringify(player.world.getShortData(player));
      if (player instanceof Player && player.loggedIn) {
        player.sendUpdate(data);
      }
    });
    server.entities.forEach((player) => {
      player.onetime = {};
    });
  }

  server.STEPS++;
}, 16);
