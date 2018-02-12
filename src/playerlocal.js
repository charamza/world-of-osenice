class PlayerLocal extends Player {

  constructor(game, x, y) {
    super(game, x, y);
  }

  update() {
    super.update();

    if (this.controlled) {
      this.dx = 0;
      if (this.game.input.isKeyDown(65) || this.game.input.isKeyDown(37)) this.dx = -1;
      if (this.game.input.isKeyDown(68) || this.game.input.isKeyDown(39)) this.dx = 1;

      var mmx = this.game.input.mx;
      var mmy = this.game.input.my;
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
    }
  }

  render(gl) {
    super.render(gl);
  }

}
