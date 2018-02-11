class Game {

  constructor() {
    this.canvas = document.getElementById('gamespace');
    this.gl = this.canvas.getContext('2d');

    window.onresize = (e) => this.onresize(e);
    this.onresize();

    this.input = new Input(this);
    this.camera = new Camera(this);
    this.world = new World(this);
    this.player = new Player(this, 0, -860);

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
    this.player.update();
    this.camera.update(this.player);

    this.STEPS++;
    this.render();
  }

  render() {
    this.gl.clearRect(0, 0, this.WIDTH, this.HEIGHT);
    this.world.render(this.gl);
    this.player.render(this.gl);
    window.requestAnimationFrame(() => this.update());
  }

}

var game = new Game();
game.start();
