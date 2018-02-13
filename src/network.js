class Network {

  constructor(game) {
    this.game = game;
    this.address = '127.0.0.1';
    this.port = '6060';
    this.loggedIn = false;

    this.pid = -1; // Player's id
    this.entities = {};

    this.updateData = null;
    this.updateDataCache = {};
  }

  connect() {
    this.socket = new WebSocket('ws://' + this.address + ':' + this.port);
    this.socket.onmessage = (e) => this.receive(e);
    this.socket.onclose = function() {
      window.location = '';
    };
    this.socket.onerror = function() {
      alert('Server is currently offline.');
    };
  }

  login(name) {
    var data = {
      state: 'login',
      name: name
    };
    this.send(data);
    this.loggedIn = true;
  }

  add(key, value, force) {
    if (typeof force === 'undefined') force = false;
    if (force || this.updateDataCache[key] != value) {
      if (this.updateData == null) {
        this.updateData = {
          state: 'update',
        };
      }
      this.updateData[key] = value;
      this.updateDataCache[key] = value;
    }
  }

  update() {
    if (!this.loggedIn) return;
    if (this.game.STEPS % 2 == 0) return;
    if (this.updateData == null) return;

    this.send(this.updateData);
    this.updateData = null;
  }

  receive(e) {
    var data = JSON.parse(e.data);
    var state = data.state;

    switch(state) {
      case 'login':
        this.game.chat.addMessage('MOTD', data.motd);
        this.game.load();
        this.pid = data.id;
        this.game.player.px = data.px;
        this.game.player.py = data.py;
        this.game.player.name = data.name;
        break;
      case 'update':
        var entities = data.e;
        for (var id in entities) {
          if (entities.hasOwnProperty(id)) {
            var entityData = entities[id];
            if (id == this.pid) {
              this.game.player.synchronize(entityData);
            } else if (typeof this.entities[id] === 'undefined') {
              if (this.game.LOADED) {
                var entity = new Player(this.game, entityData.px, entityData.py);
                entity.synchronize(entityData);
                this.entities[id] = entity;
                this.game.world.entities.push(entity);
              }
            } else {
              this.entities[id].synchronize(entityData);
            }
          }
        }
        for (var id in this.entities) {
          if (this.entities.hasOwnProperty(id)) {
            if (entities[id] === undefined) {
              var index = this.game.world.entities.indexOf(this.entities[id]);
              if (index != -1) {
                this.game.world.entities.splice(index, 1);
              }
              delete this.entities[id];
            }
          }
        }
        break;
    }
  }

  send(data) {
    this.socket.send(JSON.stringify(data));
  }

}
