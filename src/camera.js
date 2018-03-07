class Camera {

  constructor(game) {
    this.game = game;
    this.x = 0;
    this.y = 0;
    this.cx = 0;
    this.cy = 0;
  }

  update(entity) {
    this.x = this.game.WIDTH / 2 - entity.getX();
    this.y = this.game.HEIGHT / 2 - entity.getY();
    this.cx = entity.getX();
    this.cy = entity.getY();
  }

  translate(gl) {
    gl.translate(this.x, this.y);
  }

  getScreenBounds() {
    return {x1: -this.x, y1: -this.y, x2: -this.x + this.game.WIDTH, y2: -this.y + this.game.HEIGHT};
  }

}
