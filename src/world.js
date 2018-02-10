class World {

  constructor(game) {
    this.game = game;
    this.setup();
  }

  setup() {
    this.lines = [];

    var iterations = 40;
    var gap = 360 / iterations;
    var distance = 300;
    var cx = 0;
    var cy = 0;

    for (var i = 0; i < iterations; i++) {
      var a1 = i * gap * Math.PI / 180;
      var a2 = (i + 1) * gap * Math.PI / 180;
      var x1 = Math.sin(a1) * distance + cx;
      var y1 = Math.cos(a1) * distance + cy;
      var x2 = Math.sin(a2) * distance + cx;
      var y2 = Math.cos(a2) * distance + cy;
      this.lines.push({x1: x1, y1: y1, x2: x2, y2: y2});
    }
  }

  update() {

  }

  render(gl) {
    gl.save();
    gl.translate(this.game.WIDTH / 2, this.game.HEIGHT / 2);
    gl.beginPath();
    gl.lineWidth = 2;
    gl.strokeStyle = 'green';
    for (var i = 0; i < this.lines.length; i++) {
      var line = this.lines[i];
      gl.moveTo(line.x1, line.y1);
      gl.lineTo(line.x2, line.y2);
    }
    gl.stroke();
    gl.restore();
  }

}
