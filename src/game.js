class Game {

  constructor() {
    this.canvas = document.getElementById('gamespace');
    this.gl = this.canvas.getContext('2d', { alpha: false });

    window.onresize = (e) => this.onresize(e);
    this.onresize();

    this.resources = new Resources(this);
    this.chat = new Chat(this);
    this.input = new Input(this);
    this.camera = new Camera(this);
    this.network = new Network(this);
    this.lastFrame = performance.now();
    this.STEPS = 0;
    this.LOADED = false;
  }

  start(name, color) {
    this.network.connect();
    this.network.socket.onopen = () => this.network.login(name, color);

    window.requestAnimationFrame(() => this.update());
    //this.resources.music.play();
  }

  load(worldname, callback) {
    this.world = new World(this, worldname);
    this.world.setup(() => {
      var firstTime = false;
      if (typeof this.player === 'undefined') {
        this.player = new PlayerLocal(this, 0, 860);
        firstTime = true;
      }
      this.LOADED = true;
      callback(this.player, firstTime);
    });
  }

  unloadWorld() {
    this.LOADED = false;
  }

  onresize() {
    this.canvas.width = this.WIDTH = window.innerWidth;
    this.canvas.height = this.HEIGHT = window.innerHeight - 1;
  }

  update() {
    let delta = performance.now() - this.lastFrame;
    this.lastFrame = performance.now();

    if (this.LOADED) {
      this.world.update();
      this.player.update();
      this.camera.update(this.player);
      this.network.update();
    }

    this.STEPS++;
    this.render();
  }

  render() {
	this.gl.fillStyle='#fff';
	this.gl.fillRect(0, 0, this.WIDTH, this.HEIGHT);

    if (this.LOADED) {
      this.world.render(this.gl);
      this.player.render(this.gl);
      this.world.postrender(this.gl);
    }

    window.requestAnimationFrame(() => this.update());
  }

}


document.querySelector('.osenice-login-text').focus();
document.querySelector('.osenice-login-button').onclick = document.querySelector('.osenice-login-text').onkeypress = (e) => {
  if (e instanceof KeyboardEvent && e.keyCode != 13) return;
  var name = document.querySelector('.osenice-login-text').value;
  var color = document.querySelector('.osenice-login-color').value;
  if (name.length >= 3 && name.length <= 20) {
    document.querySelector('.osenice-chat').style = "";
    document.querySelector('.osenice-login').remove();
    var game = new Game();
    game.start(name, color);
  } else {
    alert("Jméno musí být dlouhé alespoň 3 znaky a maximálně 20 znaků.");
  }
};
