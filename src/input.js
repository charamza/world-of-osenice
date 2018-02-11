class Input {

  constructor(game) {
    this.game = game;
    this.keys = {};

    this.mx = this.game.WIDTH / 2;
    this.my = this.game.HEIGHT / 2;

    window.onmousemove = (e) => this.onmousemove(e);
    window.onkeydown = (e) => this.onkeydown(e);
    window.onkeyup = (e) => this.onkeyup(e);
  }

  onmousemove(e) {
    this.mx = e.clientX;
    this.my = e.clientY;
    //console.log(this.mx, this.my);
  }

  onkeydown(e) {
    this.keys[e.keyCode] = true;
  }

  onkeyup(e) {
    this.keys[e.keyCode] = false;
  }

  isKeyDown(keycode) {
    return (typeof this.keys[keycode] !== 'undefined' && this.keys[keycode]);
  }

}
