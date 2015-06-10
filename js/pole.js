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
  console.log(this.scale.x)
  if(this.scale.x == 2){
    game.add.tween(this.scale).to( { x: 1}, 2000, Phaser.Easing.Linear.None, true, 20, 1000, true);
  }

  if(player.jumping && !player.falling)
    this.body.velocity.x = player.jumpPower;
  else
    this.body.velocity.x = -20;

  if(this.x < -this.width) {
    this.destroy();
    poleGroup.create();
  }
};
