class Camera {

  constructor(game) {
    this.game = game;
    this.x = 0;
    this.y = 0;
  }

  update(entity) {
    this.x = game.WIDTH / 2 - entity.x;
    this.y = game.HEIGHT / 2 - entity.y;
  }

  translate(gl) {
    gl.translate(this.x, this.y);
  }

}
