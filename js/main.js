'use strict';

var innerWidth = window.innerWidth;
var innerHeight = window.innerHeight;
var gameRatio = innerWidth/innerHeight;   
var score;
var scoreText;
var topScore;
var player;
var poleGroup;
var platformGroup;
var time;

var game = new Phaser.Game(Math.floor(480*gameRatio), 480, Phaser.CANVAS, '', {
  preload: preload,
  create: create,
  update: update
});

function preload() {
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.setScreenSize(true);
  game.load.image("player", "assets/img/ninja.png"); 
  game.load.image("pole", "assets/img/pole.png");
  game.load.image("powerbar", "assets/img/powerbar.png");
  //game.load.image("platform", "assets/img/platform.png");
  game.load.image("platform", "assets/img/Cloud-not-a-bush.gif");
}

function create() {
  score = 0;
  topScore = (localStorage.getItem("score")==null)? 0: localStorage.getItem("score");
  scoreText = game.add.text(10, 10, "-", {
    font: "bold 16px Arial",
    fill: '#FFFFFF'
  });
  updateScore();
  game.stage.backgroundColor = "#87CEEB";
  time = 0;
  game.bitmap = game.add.bitmapData(game.width, game.height);
  game.bitmap.context.fillStyle = 'rgb(255, 255, 255)';
  game.bitmap.context.strokeStyle = 'rgb(255, 255, 255)';
  game.add.image(0, 0, game.bitmap);

  game.physics.startSystem(Phaser.Physics.ARCADE);

  /*poleGroup = new PoleGroup();
  poleGroup.addPole(80);*/

  platformGroup = new PlatformGroup();
  platformGroup.addPlatform(80);

  player = new Player(80, 0);

  game.input.onDown.add(player.prepareToJump, player);
}

function update() {
  drawTrajectory();
  game.physics.arcade.collide(player, poleGroup, checkLanding);
  game.physics.arcade.collide(player, platformGroup, checkLanding);
  
  if(player.die(game.height)) {
    localStorage.setItem("score", Math.max(score,topScore));  
    game.state.start(game.state.current);
  }
}

function drawTrajectory() {
      // Clear the bitmap
      game.bitmap.context.clearRect(0, 0, game.width, game.height);

      // Set fill style to white
      game.bitmap.context.fillStyle = 'rgba(255, 255, 255, 0.5)';

      // Calculate a time offset. This offset is used to alter the starting
      // time of the draw loop so that the dots are offset a little bit each
      // frame. It gives the trajectory a "marching ants" style animation.
      var MARCH_SPEED = 40; // Smaller is faster
      game.timeOffset = game.timeOffset + 1 || 0;
      game.timeOffset = game.timeOffset % MARCH_SPEED;

      // Just a variable to make the trajectory match the actual track a little better.
      // The mismatch is probably due to rounding or the physics engine making approximations.
      var correctionFactor = 0.99;

      // Draw the trajectory
      // http://en.wikipedia.org/wiki/Trajectory_of_a_projectile#Angle_required_to_hit_coordinate_.28x.2Cy.29
      var theta = 0.90;
      var x = 0, y = 0;
      for(var t = 0 + game.timeOffset/(1000*MARCH_SPEED/60); t < 3; t += 0.03) {
          x = 800 * t * Math.cos(theta) * correctionFactor;
          y = player.jumpPower * t * Math.sin(theta) * correctionFactor - 0.5 * player.gravity * t * t;
          game.bitmap.context.fillRect(x + player.x, player.y - y, 4, 4);
          //console.log('x '+x);
          console.log('y '+y);
          if (y < -15) break;
      }

      game.bitmap.dirty = true;
  };

function updateScore(){
  scoreText.text = "Score: " + score + "\nBest: " + topScore; 
}

function removeTweens(){
  player.tweens.move.stop();
}

function checkLanding(player, pole){
  if(pole.y >= player.y + player.height / 2){
    var dist = player.x - pole.x;
    player.falling = false;

    player.body.velocity.x = 0;

    if(player.jumping && Math.abs(dist) > 45) {
      removeTweens();
      player.body.velocity.x = dist * 2;
      player.body.velocity.y = -200;
    }
    
    var poleDiff = pole.number - player.lastPole;
    if(poleDiff > 0) {
      score += Math.pow(2, poleDiff);
      updateScore();  
      player.lastPole = pole.number;
    }

    if(player.jumping) {
      player.jumping = false;              
      game.input.onDown.add(player.prepareToJump, player);
    }
  }
  else {
    removeTweens();
    player.falling = true;
    platformGroup.forEach(function(item) {
      item.body.velocity.x = 0;     
    });
  }     
}
