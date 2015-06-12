'use strict';

var PlatformGroup = function() {
  Phaser.Group.call(this, game);
  this.count = 0;
};

PlatformGroup.prototype = Object.create(Phaser.Group.prototype);
PlatformGroup.prototype.constructor = PlatformGroup;

PlatformGroup.prototype.create = function() {
  var max = 0;
  this.forEach(function(item) {
    max = Math.max(item.x, max);     
  });
  
  this.addPlatform(max + game.rnd.between(100, 300));      
};

PlatformGroup.prototype.addPlatform = function(x) {
  while(x < 2 * game.width) {
    this.count++;
    var platform = new Platform(x, game.rnd.between(200, 400));
    game.add.existing(platform);
    platform.anchor.set(0.5, 0.5);
    this.add(platform);

    x += game.rnd.between(100, 300);
  }
};