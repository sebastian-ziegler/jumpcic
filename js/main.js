'use strict';

var innerWidth = window.innerWidth;
var innerHeight = window.innerHeight;
var gameRatio = innerWidth/innerHeight;   
var score;
var scoreText;
var topScore;
var player;
var poleGroup;

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

  game.physics.startSystem(Phaser.Physics.ARCADE);

  poleGroup = new PoleGroup();
  poleGroup.addPole(80);

  player = new Player(80, 0);

  game.input.onDown.add(player.prepareToJump, player);
}

function update() {
  game.physics.arcade.collide(player, poleGroup, checkLanding);
  
  if(player.die(game.height)) {
    localStorage.setItem("score", Math.max(score,topScore));  
    game.state.start(game.state.current);
  }
}

function updateScore(){
  scoreText.text = "Score: " + score + "\nBest: " + topScore; 
}     

function checkLanding(player, pole){
  if(pole.y >= player.y + player.height / 2){
    var dist = player.x - pole.x;
    
    player.body.velocity.x = 0;

    if(player.jumping && Math.abs(dist) > 20) {
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
    player.falling = true;
    poleGroup.forEach(function(item) {
      item.body.velocity.x = 0;     
    });
  }     
}
