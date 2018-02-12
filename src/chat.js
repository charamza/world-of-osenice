class Chat {

  constructor(game) {
    this.game = game;
    this.chat = document.querySelector('.osenice-chat');
    this.chatMessages = document.querySelector('.osenice-chat-messages');
    this.chatTextbox = document.querySelector('.osenice-chat-addition-text');
    this.active = false;

    this.chatTextbox.onfocus = () => {
      this.active = true;
    };
    this.chatTextbox.onblur = () => {
      this.active = false;
    };
  }

  onenter() {
    if (this.active) {
      var value = this.chatTextbox.value;
      this.chatTextbox.value = '';
      this.sendMessage(value);
      this.blur();
    } else {
      this.focus();
    }
  }

  focus() {
    var value = this.chatTextbox.value;
    this.chatTextbox.value = '';
    this.chatTextbox.focus();
    this.chatTextbox.value = value;
    this.active = true;
  }

  blur() {
    this.chatTextbox.blur();
    this.active = false;
  }

  sendMessage(message) {
    if (message == '') return;
    if (message.length > 1000) {
      this.addMessage('Server', 'Tvoje zpráva je moc dlouhá, napiš novou a kratší...');
      return;
    }
    this.addMessage('Honza', message);
    this.game.player.lastMessages.unshift([message, this.game.STEPS]);
    this.game.network.add('message', message, true);
  }

  addMessage(name, message) {
    var node = document.createElement("div");
    var textnode = document.createTextNode(name + ': ' + message);
    node.appendChild(textnode);
    this.chatMessages.appendChild(node);
  }

}
