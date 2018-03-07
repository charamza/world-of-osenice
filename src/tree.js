class Tree extends Entity{

  constructor(game, px, ox = 0) {
    super(game, Math.sin(px * Math.PI / 180) * (game.world.radius + 40 + ox), -Math.cos(px * Math.PI / 180) * (game.world.radius + 40 + ox), 40, 80);

    this.crown = [];

    for(var i = 0; i < 3; i++) {
      var angle = Math.abs(Math.PI * i / 2 + Math.random() * Math.PI) % Math.PI + Math.PI / 2;
      this.crown.push(Math.sin(angle) * 30);
      this.crown.push(-40 + Math.cos(angle) * 30);
      this.crown.push(Math.abs(10 * Math.sin(i * Math.PI / 5 + Math.PI)) + 10);
      this.crown.push('rgb(0, ' + Math.floor(Math.random() * 127 + 128) + ', 0)');
    }
    this.crown.push(0);
    this.crown.push(-70);
    this.crown.push(30 + Math.random() * 10);
    this.crown.push('rgb(0, ' + Math.floor(Math.random() * 127 + 128) + ', 0)');
  }

  update() {
    super.update();
    //this.rot = Math.atan2(-this.getX(), this.getY());
  }

  render(gl) {
    super.render(gl);

    gl.save();
    gl.translate(this.getX(), this.getY());
    gl.rotate(-this.rot);
    gl.lineWidth = 2;

    gl.fillStyle = "brown";
    gl.beginPath();
    for (var i = 0; i < this.crown.length / 4; i++) {
      var x = this.crown[i * 4];
      var y = this.crown[i * 4 + 1];

      gl.moveTo(x + 2, y);
      gl.lineTo(2, -20);
      gl.lineTo(-2, -20);
      gl.lineTo(x - 2, y);
      gl.fill();
    }
    gl.moveTo(-5, -40);
    gl.lineTo(-5, -40);
    gl.lineTo(-10, 20);
    gl.lineTo(-20, 40);
    gl.lineTo(20, 40);
    gl.lineTo(10, 20);
    gl.lineTo(5, -40);
    gl.fill();

    gl.restore();
  }

  postrender(gl) {
    super.render(gl);

    gl.save();
    gl.translate(this.getX(), this.getY());
    gl.rotate(-this.rot);
    gl.lineWidth = 2;
    for (var i = 0; i < this.crown.length / 4; i++) {
      var x = this.crown[i * 4];
      var y = this.crown[i * 4 + 1];
      var radius = this.crown[i * 4 + 2];
      var color = this.crown[i * 4 + 3];

      gl.fillStyle = color;
      gl.beginPath();
      gl.moveTo(x + radius, y);
      gl.arc(x, y, radius, 0, Math.PI*2, false);
      gl.fill();
    }
    gl.restore();
  }

}
