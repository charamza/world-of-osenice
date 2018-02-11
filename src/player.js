class Player extends Entity {

  constructor(game, x, y) {
    super(game, x, y, 32, 32);

    this.rot = 0;
    this.eyeRot = 0;
    this.steps = 0;

    this.leftEye = [10, 0];
    this.rightEye = [10, 0];

    this.falling = 0;

    this.polygon = new SAT.Box(new SAT.Vector(), this.width, this.height).toPolygon();
  }

  update() {
    super.update();


    this.rot = Math.atan2(-this.x, -this.y);
    this.falling += 16;
    var vFalling = this.falling / 100;
    var mx = Math.sin(this.rot) * vFalling + this.dx * Math.cos(-this.rot) * 6;
    var my = Math.cos(this.rot) * vFalling + this.dx * Math.sin(-this.rot) * 6;
    var colliding = false;

    this.polygon.setOffset(new SAT.Vector(this.x + mx - this.width / 2 + 8 * Math.sin(this.rot), this.y - this.height / 2 + 8 * Math.cos(this.rot)));
    var collX = this.game.world.collision(this.polygon);
    this.polygon.setOffset(new SAT.Vector(this.x - this.width / 2 + 8 * Math.sin(this.rot), this.y + my - this.height / 2 + 8 * Math.cos(this.rot)));
    var collY = this.game.world.collision(this.polygon);
    if (collX != null) {
      this.x -= collX.overlapV.x;
      colliding = true;
    } else {
      this.x += mx;
    }

    if (collY != null) {
      this.y -= collY.overlapV.y;
      colliding = true;
    } else {
      this.y += my;
    }

    if (colliding) {
      this.falling = 0;
      if (this.game.input.isKeyDown(32)) this.jump();
    }

    var diffX = this.game.input.mx - this.game.WIDTH / 2;
    var diffY = this.game.input.my - this.game.HEIGHT / 2;

    var angle = -Math.atan2(diffX, diffY) + Math.PI / 2 + this.rot;
    var distance = Math.sqrt(diffX * diffX + diffY * diffY);

    this.eyeRot = angle;

    var dist = distance / 10;
    if (dist > 15) dist = 15;
    this.leftEye[0] = Math.cos(this.eyeRot) * dist - 5;
    this.leftEye[1] = Math.sin(this.eyeRot) * dist / 15 * 10;
    this.rightEye[0] = Math.cos(this.eyeRot) * dist + 5;
    this.rightEye[1] = Math.sin(this.eyeRot) * dist / 15 * 10;

    if (this.leftEye[0] > 10) this.leftEye[0] = 10;
    if (this.leftEye[0] < -10) this.leftEye[0] = -10;
    if (this.rightEye[0] > 10) this.rightEye[0] = 10;
    if (this.rightEye[0] < -10) this.rightEye[0] = -10;

    this.dx = 0;
    if (this.game.input.isKeyDown(65) || this.game.input.isKeyDown(37)) this.dx = -1;
    if (this.game.input.isKeyDown(68) || this.game.input.isKeyDown(39)) this.dx = 1;
    if (this.dx == 0) this.steps = 0; else this.steps++;
  }

  render(gl) {
    super.render(gl);

    gl.save();
    this.game.camera.translate(gl);
    gl.translate(this.x, this.y);
    gl.rotate(-this.rot);

    gl.lineWidth = 2;
    gl.strokeStyle = 'black';

    gl.beginPath();
    gl.arc(0, 0, this.width / 2, 0, Math.PI * 2);
    gl.stroke();

    for (var i = 0; i < 2; i++) {
      var eye = (i == 0 ? this.leftEye : this.rightEye);
      gl.save();
      gl.beginPath();
      gl.arc(eye[0], eye[1], 3, 0, Math.PI * 2);
      gl.stroke();
      gl.restore();
    }

    for (var i = 0; i < 2; i++) {
      gl.save();
      gl.beginPath();
      gl.rotate(Math.sin(this.steps / 10) * (i == 0 ? -1 : 1) / 3 * 2);
      gl.arc(0, this.height / 2 + 5, 5, Math.PI, Math.PI * 2);
      gl.moveTo(-6, this.height / 2 + 6);
      gl.lineTo(6, this.height / 2 + 6);
      gl.stroke();
      gl.restore();
    }

    gl.restore();
  }

  jump() {
    this.falling = -700;
  }

}
