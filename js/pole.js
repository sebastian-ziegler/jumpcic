'use strict';

var Pole = function(x, y) {
  Phaser.Sprite.call(this, game, x, y, "pole");
  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.body.immovable = true;
  this.number = poleGroup.count;
};

Pole.prototype = Object.create(Phaser.Sprite.prototype);
Pole.prototype.constructor = Pole;

Pole.prototype.update = function() {
  if(player.jumping && !player.falling)
    this.body.velocity.x = player.jumpPower;
  else
    this.body.velocity.x = 0

  if(this.x < -this.width) {
    this.destroy();
    poleGroup.create();
  }
};
