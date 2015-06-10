'use strict';

var Platform = function(x, y) {
  Phaser.Sprite.call(this, game, x, y, "platform");
  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.body.immovable = true;
  this.number = platformGroup.count;
};

Platform.prototype = Object.create(Phaser.Sprite.prototype);
Platform.prototype.constructor = Platform;

Platform.prototype.update = function() {
  console.log(this.scale.x)

  if(player.jumping && !player.falling)
    this.body.velocity.x = player.jumpPower;
  else
    this.body.velocity.x = -20;

  if(this.x < -this.width) {
    this.destroy();
    platformGroup.create();
  }
};
