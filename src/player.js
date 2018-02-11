class Player extends Entity {

  constructor(game, px, y) {
    super(game, 0, y, 32, 32);

    this.px = px;
    this.py = y;

    this.eyeRot = 0;
    this.steps = 0;

    this.leftEye = [-5, 0];
    this.rightEye = [5, 0];
    this.legSpread = 0;
    this.legRot = 0;

    this.cursor = [game.WIDTH / 2, game.HEIGHT / 2];

    this.falling = 0;
  }

  update() {
    super.update();

    this.falling += 16;
    var vFalling = this.falling / 100;
    var colliding = false;

    var mx = this.dx * 0.5;
    var my = -vFalling;

    this.polygon.setOffset(new SAT.Vector(0, - this.py - 10));
    var collX = this.game.world.collision(this.polygon, -(this.px + mx - 1.4) * Math.PI / 180);
    this.polygon.setOffset(new SAT.Vector(0, - this.py - my - 7));
    var collY = this.game.world.collision(this.polygon, -(this.px - 1.4) * Math.PI / 180);
    if (collX != null) {
      if (collX.climbable && this.falling >= 0) {
        this.py += collX.overlapV.y;
      }
    } else {
      this.px += mx;
    }

    if (collY != null) {
      this.py += collY.overlapV.y;
      this.falling = 0;
      if (this instanceof PlayerLocal && this.game.input.isKeyDown(32)) this.jump();
      var platformNormal = Math.atan2(collY.overlapN.x, collY.overlapN.y);
      this.legRot = platformNormal;// - this.rot;
      //this.legRot = (this.legRot + Math.PI) % (Math.PI * 2) - Math.PI;
    } else {
      this.py += my;
    }

    var diffX = this.cursor[0] - this.game.WIDTH / 2;
    var diffY = this.cursor[1] - this.game.HEIGHT / 2;

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

    this.legSpread = 8 - (Math.abs(diffX * Math.cos(this.rot)) + Math.abs(diffY * Math.sin(this.rot))) / 20;
    if (this.legSpread < 0) this.legSpread = 0;

    if (this.dx == 0) this.steps = 0; else this.steps++;
  }

  render(gl) {
    super.render(gl);

    gl.save();
    if (this instanceof PlayerLocal) this.game.camera.translate(gl);
    var mx = this.getX();
    var my = this.getY();
    gl.translate(mx, my);
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
      gl.translate(this.legSpread * (i == 0 ? 1 : -1), 0);
      gl.rotate(-this.legRot + Math.sin(this.steps / 10) * (i == 0 ? -1 : 1) / 3 * 2);
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

  getX() {
    return Math.sin(this.px * Math.PI / 180) * this.py;
  }

  getY() {
    return -Math.cos(this.px * Math.PI / 180) * (this.py - 3);
  }

}
