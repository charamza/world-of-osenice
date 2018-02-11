class World {

  constructor(game) {
    this.game = game;
    this.setup();

    this.rot = 0;
  }

  setup() {
    this.platforms = [];

    var iterations = 40;
    var gap = 360 / iterations;
    var distance = 800;
    var cx = 0;
    var cy = 0;

    for (var i = 0; i < iterations - 2; i++) {
      var a1 = i * gap * Math.PI / 180;
      var a2 = (i + 1) * gap * Math.PI / 180;
      var x1 = Math.sin(a1) * distance + cx;
      var y1 = Math.cos(a1) * distance + cy;
      var x2 = Math.sin(a2) * distance + cx;
      var y2 = Math.cos(a2) * distance + cy;
      this.platforms.push(new Platform(x1, y1, x2, y2));
    }
    this.platforms.push(new Platform(
      Math.sin(38 * gap * Math.PI / 180) * distance,
      Math.cos(38 * gap * Math.PI / 180) * distance,
      Math.sin(38 * gap * Math.PI / 180) * distance / 6 * 5,
      Math.cos(38 * gap * Math.PI / 180) * distance / 6 * 5
    ));
    this.platforms.push(new Platform(
      Math.sin(40 * gap * Math.PI / 180) * distance,
      Math.cos(40 * gap * Math.PI / 180) * distance,
      Math.sin(40 * gap * Math.PI / 180) * distance / 6 * 5,
      Math.cos(40 * gap * Math.PI / 180) * distance / 6 * 5
    ));
    this.platforms.push(new Platform(
      Math.sin(38 * gap * Math.PI / 180) * distance / 6 * 5,
      Math.cos(38 * gap * Math.PI / 180) * distance / 6 * 5,
      Math.sin(40 * gap * Math.PI / 180) * distance / 6 * 5,
      Math.cos(40 * gap * Math.PI / 180) * distance / 6 * 5
    ));
  }

  update() {
    for (var i = 0; i < this.platforms.length; i++) {
      this.platforms[i].polygon.setAngle(this.game.player.rot);
    }
  }

  render(gl) {
    gl.save();
    this.game.camera.translate(gl);
    gl.beginPath();
    gl.lineWidth = 2;
    gl.strokeStyle = 'green';
    for (var i = 0; i < this.platforms.length; i++) {
      this.platforms[i].render(gl);
    }
    gl.stroke();
    gl.restore();
  }

  collision(other) {
    var response = new SAT.Response();
    for (var i = 0; i < this.platforms.length; i++) {
      if (this.platforms[i].collision(other, response)) {
        return response;
      }
    }
    return null;
  }

}
