class Player extends Entity {

  constructor(game, px, y) {
    super(game, 0, y, 32, 32);

    this.px = px;
    this.py = y;

    this.mx = game.WIDTH / 2;
    this.my = game.HEIGHT / 2;

    this.eyeRot = 0;
    this.steps = 0;

    this.hideEyes = false;
    this.leftEye = [-5, 0];
    this.rightEye = [5, 0];
    this.legSpread = 0;
    this.legRot = 0;

    this.lastMessages = [];
    this.collidingTeleport = null;
    this.collidingTeleportSteps = -200;
    this.teleportLocation = '';
    this.teleportingSteps = -1;

    this.name = "";

    this.controlled = true;
    this.cursor = [game.WIDTH / 2, game.HEIGHT / 2];

    this.standing = false;
    this.falling = 0;
    this.color = 'rgb(255, 0, 0)';
  }

  update() {
    super.update();

    this.hideEyes = false;
    this.controlled = true;
    if (this.teleportingSteps != -1) {
      this.teleportingSteps++;
      this.controlled = false;
      this.dx = 0;
      this.legRot = 0;

      this.cursor[0] = this.game.WIDTH / 2 + Math.sin(this.teleportingSteps * 5 * Math.PI / 180) * 200 * Math.cos(this.rot);
      this.cursor[1] = this.game.HEIGHT / 2 + Math.cos(this.teleportingSteps * 5 * Math.PI / 180) * 200 * Math.sin(this.rot);
      if (this.teleportingSteps % 72 >= 36) {
        this.hideEyes = true;
      }

      if (this.teleportingSteps > 200) {
        this.teleportTo();
      }
    }

    this.falling += 16;
    var vFalling = this.falling / 100;
    var colliding = false;

    var mx = this.dx * 400 / this.game.world.radius;
    var my = -vFalling;

    this.polygon.setAngle(0);
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
      if (this.standing && this.dx != 0) {
        this.game.resources.gravel.play();
      }
    }

    if (collY != null) {
      if (collY.climbable) {
        this.py += collY.overlapV.y;
        this.falling = 0;
      }
      if (collY.climbable && this.teleportingSteps == -1) {
        var legRot = Math.atan2(collY.overlapN.x, collY.overlapN.y);
        if (Math.abs(legRot) < Math.PI / 4) {
          this.legRot = legRot;
        }
      }
      if (this.controlled && this instanceof PlayerLocal && this.game.input.isKeyDown(32)) {
        this.jump();
        this.game.network.add('jump', this.px, true);
      }
      this.standing = true;
    } else {
      this.py += my;
      this.standing = false;
    }

    var collE = this.game.world.collisionEntities(this);
    var collidesWithTeleport = false;
    for (var centity of collE) {
      if (centity instanceof Teleport) {
        collidesWithTeleport = true;
        if (this.collidingTeleport == centity) {
          if (this.game.input.isKeyDown(84) && this instanceof PlayerLocal) {
            this.teleportTrigger(centity);
            this.teleportLocation = centity.worldname;
          }
        } else {
          this.collidingTeleport = centity;
          this.collidingTeleportSteps = 0;
        }
      }
    }
    if (!collidesWithTeleport) {
      this.collidingTeleport = null;
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

    var mmx = this.mx;
    var mmy = this.my;
    if (mmx > this.game.WIDTH / 2 + 200) mmx = this.game.WIDTH / 2 + 200;
    if (mmx < this.game.WIDTH / 2 - 200) mmx = this.game.WIDTH / 2 - 200;
    if (mmy > this.game.HEIGHT / 2 + 200) mmy = this.game.HEIGHT / 2 + 200;
    if (mmy < this.game.HEIGHT / 2 - 200) mmy = this.game.HEIGHT / 2 - 200;
    var diffX = mmx - this.cursor[0];
    var diffY = mmy - this.cursor[1];
    var diffAngle = Math.atan2(diffX, diffY);
    var transitionSpeed = 12;
    if (diffX > transitionSpeed) diffX = transitionSpeed;
    if (diffX < -transitionSpeed) diffX = -transitionSpeed;
    if (diffY > transitionSpeed) diffY = transitionSpeed;
    if (diffY < -transitionSpeed) diffY = -transitionSpeed;
    this.cursor[0] += diffX;
    this.cursor[1] += diffY;

    if (this.dx == 0) this.steps = 0; else this.steps++;
  }

  render(gl) {
    super.render(gl);

    var backToNormal = 1;
    if (this.teleportingSteps > 300) {
      backToNormal = (200 - (this.teleportingSteps - 300)) / 200;
      if (backToNormal < 0) backToNormal = 0;
    }

    gl.save();
    if (this instanceof PlayerLocal) this.game.camera.translate(gl);
    var mx = this.getX();
    var my = this.getY();
    gl.translate(mx, my);
    gl.translate(-Math.sin(this.rot) * this.teleportingSteps / 10 * backToNormal, -Math.cos(this.rot) * this.teleportingSteps / 10 * backToNormal);
    gl.rotate(-this.rot * backToNormal);

    gl.lineWidth = 2;
    gl.strokeStyle = this.color;//'black';

    gl.beginPath();
    gl.arc(0, 0, this.width / 2, 0, Math.PI * 2);
    gl.fillStyle = '#fff';//this.color;
    gl.fill();
    gl.stroke();

    if (!this.hideEyes) {
      gl.strokeStyle = 'black';
      for (var i = 0; i < 2; i++) {
        var eye = (i == 0 ? this.leftEye : this.rightEye);
        gl.save();
        gl.beginPath();
        gl.arc(eye[0], eye[1], 3, 0, Math.PI * 2);
        gl.fillStyle = '#fff';
        gl.fill();
        gl.stroke();
        gl.restore();
      }
    }

    gl.strokeStyle = this.color;//'black';
    for (var i = 0; i < 2; i++) {
      gl.save();
      gl.beginPath();
      gl.translate(this.legSpread * (i == 0 ? 1 : -1), 0);
      gl.rotate(-this.legRot + Math.sin(this.steps / 10) * (i == 0 ? -1 : 1) / 3 * 2);
      gl.arc(0, this.height / 2 + 5, 5, Math.PI, Math.PI * 2);
      gl.moveTo(-6, this.height / 2 + 6);
      gl.lineTo(6, this.height / 2 + 6);
      gl.fillStyle = '#fff';//this.color;
      gl.fill();
      gl.stroke();
      gl.restore();
    }

    gl.save();
    gl.font = '20px sans-serif';
    gl.textAlign="center";
    gl.fillStyle = '#000';
    gl.fillText(this.name, 0, -30);
    gl.font = '14px sans-serif';
    for (var i = 0; i < this.lastMessages.length; i++) {
      var lifetime = this.game.STEPS - this.lastMessages[i][1];
      var opacity = (400 - lifetime) / 100;
      gl.fillStyle = 'rgba(0, 0, 0, ' + opacity + ')';
      gl.fillText(this.lastMessages[i][0], 0, -60 + (-20 * i));
      if (lifetime > 400) {
        this.lastMessages.splice(i, 1);
        i--;
      }
    }
    gl.fillStyle = '#000';
    if (this.collidingTeleport != null && this.teleportingSteps == -1 && this instanceof PlayerLocal) {
      gl.fillText('Stisknutím klávesy \'T\' se přeneseš do jiného světa...', 0, 60);
    }
    gl.restore();

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

  teleportTrigger(teleentity) {
    if (this.teleportingSteps != -1) return;
    this.teleportingSteps = 0;
  }

  teleportTo(world){

  }

  synchronize(data) {
    super.synchronize(data);
    if (data.mx !== undefined) this.mx = data.mx * this.game.WIDTH;
    if (data.my !== undefined) this.my = data.my * this.game.HEIGHT;
    if (data.jump !== undefined) this.jump();
    if (data.message !== undefined) {
      var message = data.message;
      this.game.chat.addMessage(this.name, message);
      this.lastMessages.unshift([message, this.game.STEPS]);
    }
    if (data.name !== undefined) {
      this.name = data.name;
    }
  }

}
