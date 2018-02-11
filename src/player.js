class Player extends Entity {

  constructor(game, x, y) {
    super(game, x, y, 32, 32);

    this.eyeRot = 0;
    this.steps = 0;

    this.leftEye = [10, 0];
    this.rightEye = [10, 0];
  }

  update() {
    super.update();

    var diffX = this.game.input.mx - this.game.WIDTH / 2;
    var diffY = this.game.input.my - this.game.HEIGHT / 2;

    var angle = -Math.atan2(diffX, diffY) + Math.PI / 2;
    var distance = Math.sqrt(diffX * diffX + diffY * diffY);
    var dangle = angle / Math.PI * 180 % 360;

    if (dangle > 150 || dangle < 30) {
      this.eyeRot = angle % (Math.PI * 2);
    }

    this.leftEye[0] = distance / 10 + 5;
    this.rightEye[0] = distance / 10 - 5;
    if (this.leftEye[0] > 10) this.leftEye[0] = 10;
    if (this.rightEye[0] > 10) this.rightEye[0] = 10;
    if (distance / 10 < 10) {
      if (dangle < 90 || dangle > 270) {
        this.eyeRot /= Math.abs(11 - distance / 10);
      } else {
        this.eyeRot = Math.PI - (this.eyeRot - Math.PI) / Math.abs(11 - distance / 10) * (dangle < 180 ? 1 : -1);
      }
    }

    console.log(dangle);

    this.dx = 0;
    if (this.game.input.isKeyDown(65) || this.game.input.isKeyDown(37)) this.dx = -1;
    if (this.game.input.isKeyDown(68) || this.game.input.isKeyDown(39)) this.dx = 1;
    if (this.dx == 0) this.steps = 0; else this.steps++;
  }

  render(gl) {
    super.render(gl);

    gl.save();
    this.game.camera.translate(gl);

    gl.lineWidth = 2;
    gl.strokeStyle = 'black';

    gl.beginPath();
    gl.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
    gl.stroke();

    for (var i = 0; i < 2; i++) {
      var eye = (i == 0 ? this.leftEye : this.rightEye);
      gl.save();
      gl.translate(this.x, this.y);
      gl.beginPath();
      gl.rotate(this.eyeRot);
      gl.arc(eye[0], eye[1], 3, 0, Math.PI * 2);
      gl.stroke();
      gl.restore();
    }

    for (var i = 0; i < 2; i++) {
      gl.save();
      gl.beginPath();
      gl.translate(this.x, this.y);
      gl.rotate(Math.sin(this.steps / 10) * (i == 0 ? -1 : 1) / 3 * 2);
      gl.arc(0, this.height / 2 + 5, 5, Math.PI, Math.PI * 2);
      gl.moveTo(-6, this.height / 2 + 6);
      gl.lineTo(6, this.height / 2 + 6);
      gl.stroke();
      gl.restore();
    }

    gl.restore();
  }

}
