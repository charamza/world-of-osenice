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

      this.mx = this.game.input.mx;
      this.my = this.game.input.my;
    }

    this.game.network.add('dx', this.dx);
    this.game.network.add('mx', Math.floor(this.game.input.mx / this.game.WIDTH * 1000) / 1000);
    this.game.network.add('my', Math.floor(this.game.input.my / this.game.HEIGHT * 1000) / 1000);
  }

  render(gl) {
    super.render(gl);
  }

}
