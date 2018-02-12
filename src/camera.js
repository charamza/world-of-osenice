class Camera {

  constructor(game) {
    this.game = game;
    this.x = 0;
    this.y = 0;
  }

  update(entity) {
    this.x = this.game.WIDTH / 2 - entity.getX();
    this.y = this.game.HEIGHT / 2 - entity.getY();
    /*this.x -= Math.sin(this.game.world.rot) * 800;
    this.y -= Math.cos(this.game.world.rot) * 800;*/
  }

  translate(gl) {
    gl.translate(this.x, this.y);
  }

}
