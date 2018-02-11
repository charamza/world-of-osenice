class Entity {

  constructor(game, x, y, width, height) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 1.0;
    this.rot = 0;
    this.dx = 0;
    this.dy = 0;
  }

  update() {
    this.rot = Math.atan2(-this.getX(), -this.getY());
  }

  render(gl) {

  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

}
