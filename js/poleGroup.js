'use strict';

var PoleGroup = function() {
  Phaser.Group.call(this, game);
  this.count = 0;
};

PoleGroup.prototype = Object.create(Phaser.Group.prototype);
PoleGroup.prototype.constructor = PoleGroup;

PoleGroup.prototype.create = function() {
  var max = 0;
  this.forEach(function(item) {
    max = Math.max(item.x, max);     
  });
  
  this.addPole(max + game.rnd.between(100, 300));      
};

PoleGroup.prototype.addPole = function(x) {
  while(x < 2 * game.width) {
    this.count++;
    var pole = new Pole(x, game.rnd.between(250, 380));
    game.add.existing(pole);
    pole.anchor.set(0.5, 0);
    this.add(pole);

    x += game.rnd.between(100, 300);
  }
};