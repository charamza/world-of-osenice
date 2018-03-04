class World {

  constructor(game, filename) {
    this.game = game;
    this.filename = filename;
    this.name = '';

    this.data = false;

    this.opacity = 1;
    this.radius = 0;
    this.firstStep = game.STEPS;
  }

  setup(callback) {
    this.platforms = [];
    this.entities = [];

    this.getJSON('worlds/' + this.filename + '.json', (err, data) => {
      if (err !== null) {
        console.log(err);
        alert('Nepodařilo se načíst svět. Kontaktuje správce o této chybě.');
      } else {
        this.data = data;
        this.radius = this.data['tilewidth'];
        this.name = this.data['layers'][0]['name'];
        var points = this.data['layers'][0]['objects'];

        for (var i = 0; i < points.length; i++) {
          var rot = (points[i].rotation != undefined ? points[i].rotation * Math.PI / 180 : 0);
          var x1 = points[i].polyline[0]['x'] * Math.cos(rot) + points[i].polyline[0]['y'] * Math.sin(rot) - this.radius + points[i].x;
          var y1 = points[i].polyline[0]['y'] * Math.cos(rot) + points[i].polyline[0]['x'] * Math.sin(rot) - this.radius + points[i].y;
          var x2 = points[i].polyline[1]['x'] * Math.cos(rot) + points[i].polyline[1]['y'] * Math.sin(rot) - this.radius + points[i].x;
          var y2 = points[i].polyline[1]['y'] * Math.cos(rot) + points[i].polyline[1]['x'] * Math.sin(rot) - this.radius + points[i].y;
          var platform = new Platform(x1, y1, x2, y2);

          if (points[i].properties !== undefined) {
            if (points[i].properties.climbable !== undefined) platform.climbable = points[i].properties.climbable;
          }

          this.platforms.push(platform);
        }

        if (this.filename == 'roumen') {
          this.addEntity(new Teleport(this.game, -435, 50, 'forest'));
        }
        if (this.filename == 'forest') {
          this.addEntity(new Teleport(this.game, 0, -1600, 'roumen'));
        }

        callback(this);
      }
    });
  }

  getJSON(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
  }

  update() {
    for (var i = 0; i < this.entities.length; i++) {
      this.entities[i].update();
    }

    this.opacity = 1;
    if (this.game.player.teleportingSteps > 300) {
      this.opacity = (100 - (this.game.player.teleportingSteps - 300)) / 100;
      if (this.opacity < 0) {
        this.opacity = 0;
      }
      if (this.game.player.teleportingSteps == 500) {
        this.awayFromThisWorld();
      }
    }
  }

  render(gl) {
    var screen = this.game.camera.getScreenBounds();

    if (this.game.STEPS - this.firstStep < 240) {
      var opacity = Math.sin((this.game.STEPS - this.firstStep) * Math.PI / 240);
      gl.save();
      gl.font = '40px sans-serif';
      gl.textAlign = 'center';
      gl.fillStyle = 'rgba(0, 0, 0, ' + opacity + ')';
      gl.fillText('Vítej v ' + this.game.world.name, this.game.WIDTH / 2, this.game.HEIGHT / 3);
      gl.restore();
    }

    gl.save();
    this.game.camera.translate(gl);
    gl.globalAlpha = this.opacity;
    gl.beginPath();
    gl.lineWidth = 2;
    gl.strokeStyle = 'green';
    var length = 0;
    for (var i = 0; i < this.platforms.length; i++) {
      if (!this.platforms[i].inBounds(screen)) continue;
      this.platforms[i].render(gl);
      length++;
    }
    gl.stroke();
    for (var i = 0; i < this.entities.length; i++) {
      this.entities[i].render(gl);
    }
    gl.restore();
  }

  postrender(gl) {
    gl.save();
    gl.globalAlpha = this.opacity;
    this.game.camera.translate(gl);
    for (var i = 0; i < this.entities.length; i++) {
      this.entities[i].postrender(gl);
    }
    gl.restore();
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

  awayFromThisWorld() {
    this.game.network.add('world', this.game.player.teleportLocation, true);
  }

}
