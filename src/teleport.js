class Teleport extends Entity{

  constructor(game, x, y) {
    super(game, x, y, 40, 40);
  }

  update() {
    super.update();
  }

  render(gl) {
    super.render(gl);

    gl.save();
    //this.game.camera.translate(gl);
    gl.translate(this.getX(), this.getY());
    gl.rotate(this.rot);
    gl.scale(2, 1);

    this.drawCircle(gl, 0);
    this.drawCircle(gl, 1);
    this.drawCircle(gl, 2);
    this.drawCircle(gl, 3);
    this.drawCircle(gl, 4);
    this.drawCircle(gl, 5);

    gl.restore();
  }

  strokeByShift(gl, shift) {
    gl.strokeStyle = 'rgba(0, 0, 255, ' + shift / 60 + ')';
  }

  drawCircle(gl, offset) {
    gl.beginPath();
    var shift = Math.sin((this.game.STEPS + offset * 25) % 150 * Math.PI / 300) * 80;
    this.strokeByShift(gl, shift);
    gl.arc(20, 82 - shift, 10, 0, Math.PI*2, false);
    gl.stroke();
  }

}
