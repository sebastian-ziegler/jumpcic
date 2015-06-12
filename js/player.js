'use strict';

var Player = function(x, y) {
  Phaser.Sprite.call(this, game, 80, 0, 'player');
  this.gravity = 800;
  this.jumping = this.falling = false;
  this.lastPole = 1;
  this.anchor.set(0.5);
  game.physics.arcade.enable(this);
  this.body.gravity.y = this.gravity;
  game.add.existing(this);
  this.jumpPower = 0;
  //this.body.collideWorldBounds = true;
  this.tweens = {};
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  if(this.x < 15) this.x = 15;
};

Player.prototype.prepareToJump = function() {
  if(this.body.velocity.y == 0) {
    this.powerBar = game.add.sprite(this.x - 50, this.y - 50, "powerbar");
    this.powerBar.width = 0;
    this.tweens.powerTween = game.add.tween(this.powerBar).to({
      width: 100
    }, 1000, "Linear", true);
    this.jumpPower = -this.powerBar.width * 3 - 100;
    
    game.input.onDown.remove(this.prepareToJump, this);
    game.input.onUp.add(this.jump, this);
  }         
};

Player.prototype.jump = function() {
  console.log(this);
  this.jumpPower = -this.powerBar.width * 3 - 100;
  this.powerBar.destroy();
  game.tweens.removeAll();
  this.body.velocity.y = this.jumpPower * 2;
  console.log(this.jumpPower);
  this.jumping = true;
  this.tweens.powerTween.stop();
  game.add.tween(this).to({angle: this.angle + 90}, 250, Phaser.Easing.Linear.None, true).start();
  this.tweens.move = game.add.tween(this).to({x: 80}, 750, Phaser.Easing.Linear.None);
  this.tweens.move.start();
  game.input.onUp.remove(this.jump, this);
};

Player.prototype.die = function(height) {
  return this.y > height;
};
