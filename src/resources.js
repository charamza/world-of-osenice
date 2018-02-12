class Resources {

  constructor() {
    this.music = this.sound('res/music.mp3');
    this.music.volume = 0.1;
    this.gravel = this.sound('res/gravel.ogg');
  }

  load() {

  }

  sound(src) {
    var sound = document.createElement("audio");
    sound.src = src;
    sound.setAttribute("preload", "auto");
    sound.setAttribute("controls", "none");
    sound.style.display = "none";
    document.body.appendChild(sound);
    return sound;
  }

}
