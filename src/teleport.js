class Teleport extends Entity{

  constructor(game, x, y) {
    super(game, x, y, 30, 40);
  }

  update() {
    super.update();
  }

  postrender(gl) {
    super.render(gl);

    gl.save();
    //this.game.camera.translate(gl);
    gl.translate(this.getX(), this.getY());
    gl.rotate(this.rot);
    gl.scale(2, 1);
    gl.lineWidth = 1;

    this.drawCircle(gl, 0);
    this.drawCircle(gl, 1);
    this.drawCircle(gl, 2);
    this.drawCircle(gl, 3);
    this.drawCircle(gl, 4);
    this.drawCircle(gl, 5);
    this.drawCircle(gl, 6);
    this.drawCircle(gl, 7);
    this.drawCircle(gl, 8);
    this.drawCircle(gl, 9);
    this.drawCircle(gl, 10);
    this.drawCircle(gl, 11);

    gl.restore();
  }

  collision(entity) {
    return this.getDistance(entity) < (this.width + entity.width);
  }

  strokeByShift(gl, shift) {
    gl.strokeStyle = 'rgba(0, 0, 255, ' + shift / 120 + ')';
  }

  drawCircle(gl, offset) {
    gl.beginPath();
    var shift = Math.sin((this.game.STEPS + offset * 25) % 300 * Math.PI / 600) * 120;
    this.strokeByShift(gl, shift);
    gl.arc(0, 122 - shift, this.width / 3 * 2, 0, Math.PI*2, false);
    gl.stroke();
  }

}
