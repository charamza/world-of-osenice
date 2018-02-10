class Game {

  constructor() {
    this.canvas = document.getElementById('gamespace');
    this.gl = this.canvas.getContext('2d');

    window.onresize = () => this.onresize();
    this.onresize();

    this.world = new World(this);

    this.lastFrame = performance.now();
    this.STEPS = 0;
  }

  start() {
    window.requestAnimationFrame(() => this.update());
  }

  onresize() {
    this.canvas.width = this.WIDTH = window.innerWidth;
    this.canvas.height = this.HEIGHT = window.innerHeight - 1;
  }

  update() {
    let delta = performance.now() - this.lastFrame;
    this.lastFrame = performance.now();
    //console.log(delta);

    this.world.update();

    this.STEPS++;
    this.render();
  }

  render() {
    this.gl.clearRect(0, 0, this.WIDTH, this.HEIGHT);
    this.world.render(this.gl);
    window.requestAnimationFrame(() => this.update());
  }

}

var game = new Game();
game.start();
