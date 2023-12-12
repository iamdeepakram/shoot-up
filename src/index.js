/**
 * Import Phaser dependencies using `expose-loader`.
 * This makes then available globally and it's something required by Phaser.
 * The order matters since Phaser needs them available before it is imported.
 */

import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js';
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';

/**
 * Create a new Phaser game instance.
 * And render a single sprite so we make sure it works.
 */




// var game = new Phaser.Game(375, 812, Phaser.AUTO, '', { preload: preload, create: create, update: update });

// Initialize Phaser
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-container', false, false);

// Game start scene
var GameStart = function(game) {};

GameStart.prototype = {
    preload: function() {
        // Load assets for the start scene
        // Example: game.load.image('logo', 'assets/logo.png');

        game.load.image('gameLogo', './assets/images/ShootUp.png');
        game.load.image('playButton', './assets/images/PlayBtn.png');

    },

    create: function() {
        // Display start scene elements
        // Example: this.logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
        // this.logo.anchor.setTo(0.5);
        // Add any start scene functionality
        // Example: this.startButton = game.add.button(game.world.centerX, game.world.centerY + 100, 'startButton', this.startGame, this);
        // this.startButton.anchor.setTo(0.5);

        this.gameLogo = game.add.sprite(game.world.centerX, game.world.centerY - 50, 'gameLogo');
        this.gameLogo.anchor.setTo(0.5);
        this.gameLogo.scale.setTo(0.5);

        this.playButton = game.add.button(game.world.centerX, game.world.centerY + 190, 'playButton', this.showInstructions, this);
        this.playButton.anchor.setTo(0.5);
        this.playButton.scale.setTo(0.5);


    },


    showInstructions: function() {
      // Transition to the instructions scene
      game.state.start('Instructions');
    }
};

// Instructions scene
var Instructions = function(game) {};

Instructions.prototype = {
    preload: function() {
        // Load assets for the instructions scene
        game.load.image('continueButton', './assets/images/continueBtn.png');
        game.load.image('instructionsOverlay', './assets/images/InstructionScreen.png');
    },

    create: function() {
        // Display instructions overlay
        this.instructionsOverlay = game.add.sprite(game.world.centerX, game.world.centerY, 'instructionsOverlay');
        this.instructionsOverlay.anchor.setTo(0.5);
    
        // Add continue button to hide the instructions
        this.continueButton = game.add.button(game.world.centerX, game.world.centerY + 200, 'continueButton', this.hideInstructions, this);
        this.continueButton.anchor.setTo(0.5);
    },


    hideInstructions: function() {
        // Hide instructions and store in local storage
        this.instructionsOverlay.visible = false;
        localStorage.setItem('instructionsSeen', true);

        // Transition to the game play scene
        game.state.start('GamePlay');
    }
};

// Game play scene
var GamePlay = function(game) {
    this.rocket;
    this.bullets;
    this.enemies;
    this.score = 0;
    this.scoreText;
    this.pauseButton;
    this.pauseScreen;
    this.resumeButton;
    this.restartButton;
    this.isPaused = false;
    this.pauseButtonClickable = true;
    this.gameOver = false;
};

GamePlay.prototype = {
    preload: function() {
        // Load assets for the game play scene
        // InstructionScreen.png
        game.load.image('rocket', './assets/images/rocket.png');
        game.load.image('bullet', './assets/images/bullet.png');
        game.load.image('enemy', './assets/images/enemy.png');
        game.load.image('pauseButton', './assets/images/pauseButton.png');
        game.load.image('pauseScreen', './assets/images/pauseScreen.png');
        game.load.image('resumeButton', './assets/images/resumeButton.png');
        game.load.image('restartButton', './assets/images/restartButton.png');
    },

    create: function() {
        // Initialize game play elements
        // Example: this.player = game.add.sprite(100, 100, 'player');

          // Initialize game play elements
          this.rocket = game.add.sprite(game.world.centerX, game.world.height - 50, 'rocket');
          this.rocket.anchor.setTo(0.5);
          this.rocket.scale.setTo(0.2);
          this.physics.enable(this.rocket, Phaser.Physics.ARCADE);
          this.rocket.body.collideWorldBounds = true;
            // Enable debug mode for physics body
          this.rocket.body.debug = true;

          this.bullets = game.add.group();
          this.bullets.scale.setTo(0.5);
          this.bullets.enableBody = true;
          this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
          this.bullets.createMultiple(50, 'bullet');
          this.bullets.setAll('anchor.x', 0.5);
          this.bullets.setAll('anchor.y', 1);
          this.bullets.setAll('outOfBoundsKill', true);
          this.bullets.setAll('checkWorldBounds', true);

  
          this.enemies = game.add.group();
          this.enemies.scale.setTo(0.2);
          this.enemies.enableBody = true;
          this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
  
          this.scoreText = game.add.text(20, 20, 'Score: 0', { font: '20px Arial', fill: '#fff' });
  
          this.pauseButton = game.add.button(game.world.width - 20, 20, 'pauseButton', this.togglePause, this);
          this.pauseButton.anchor.setTo(1, 0);
  
          // Pause screen
          this.pauseScreen = game.add.sprite(game.world.centerX, game.world.centerY, 'pauseScreen');
          this.pauseScreen.anchor.setTo(0.5);
          this.pauseScreen.visible = false;
  
          this.resumeButton = game.add.button(game.world.centerX, game.world.centerY - 50, 'resumeButton', this.togglePause, this);
          this.resumeButton.anchor.setTo(0.5);
          this.resumeButton.visible = false;
  
          this.restartButton = game.add.button(game.world.centerX, game.world.centerY + 70, 'restartButton', this.restartGame, this);
          this.restartButton.anchor.setTo(0.5);
          this.restartButton.visible = false;
  
          this.createEnemies();
    },

    update: function() {
        // Update game play logic
        if (!this.isPaused  && !this.gameOver) {
            // Update game play logic
            this.moveRocket();
            this.fireBullet();
            this.moveEnemies();
            this.checkCollisions();
        }
    },
    moveRocket: function() {
        // Move rocket with left and right arrow keys
        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.rocket.body.velocity.x = -200;
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.rocket.body.velocity.x = 200;
        } else {
            this.rocket.body.velocity.x = 0;
        }
    },
    fireBullet: function() {
        // Fire bullet with the Enter key
        if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
            var bullet = this.bullets.getFirstExists(false);

            if (bullet) {
                bullet.reset(this.rocket.x, this.rocket.y -  this.rocket.height / 2);
                bullet.body.velocity.y = -400;
            }
        }
    },
    moveEnemies: function() {
        // Move enemies downward
        this.enemies.y += 1;

        // Check if enemies are out of bounds and create new enemies
        if (this.enemies.y > game.world.height) {
            this.enemies.y = -100;
            this.createEnemies();
        }
    },
    createEnemies: function() {
        // Create enemies at random x positions
    
        var enemy = this.enemies.create(game.rnd.integerInRange(50, game.world.width), -100, 'enemy');
        // enemy.body.velocity.y = game.rnd.integerInRange(50, 150);
        enemy.anchor.setTo(0.5, 0.5);  // Set the anchor for better rotation effects
        enemy.body.velocity.y = game.rnd.integerInRange(50, 150);
        enemy.body.velocity.x = game.rnd.integerInRange(-50, 50);  // Add a random horizontal velocity
        enemy.rotation = game.physics.arcade.angleBetween(enemy, this.rocket);  // Face the rocket initially

    },

    checkCollisions: function() {
        // Check for collisions between bullets and enemies
        game.physics.arcade.overlap(this.bullets, this.enemies, this.enemyHit, null, this);
        // Check for collision between rocket and enemies
        game.physics.arcade.overlap(this.rocket, this.enemies, this.rocketHit, null, this);
    },

    enemyHit: function(bullet, enemy) {
        // Destroy bullet and enemy when hit
        bullet.kill();
        enemy.kill();

        // Update score
        this.score += 10;
        this.scoreText.text = 'Score: ' + this.score;
    },
    togglePause: function() {
        // Toggle pause state
        this.isPaused = !this.isPaused;

        // Show/hide pause screen and buttons
        this.pauseScreen.visible = this.isPaused;
        this.resumeButton.visible = this.isPaused;
        this.restartButton.visible = this.isPaused;

        // Enable/disable pause button based on game pause state
        this.pauseButtonClickable = !this.isPaused;

        // Enable/disable input on the pause button
        this.pauseButton.inputEnabled = this.pauseButtonClickable;

        if (this.isPaused) {
            game.physics.arcade.isPaused = true;
        } else {
            game.physics.arcade.isPaused = false;
        }
    },

    restartGame: function() {
        // Restart the game
        this.isPaused = false;
        game.physics.arcade.isPaused = false;
        game.state.start('GamePlay');
    },
    rocketHit: function(rocket, enemy) {
        // Game over when the rocket is hit by an enemy planet
        this.gameOver = true;
        // Stop creating new enemies
        this.enemies.setAll('body.velocity.y', 0);
        // Disable shooting
        this.bullets.setAll('exists', false);
        // Save the score to local storage
        localStorage.setItem('gameScore', this.score);
        // Transition to the game over scene 
        game.state.start('GameOver');
    }

};

// Game over scene
var GameOver = function(game) {
    this.score;
};

GameOver.prototype = {
    preload: function() {
        // Load assets for the game over scene
        game.load.image('restartButton', './assets/images/restartButton.png');
    },

    create: function() {
        // Display game over scene elements
        // Example: this.gameOverText = game.add.text(game.world.centerX, game.world.centerY, 'Game Over', { font: '32px Arial', fill: '#fff' });
        // this.gameOverText.anchor.setTo(0.5);
        // Add any game over scene functionality
        // Example: this.restartButton = game.add.button(game.world.centerX, game.world.centerY + 50, 'restartButton', this.restartGame, this);
        // this.restartButton.anchor.setTo(0.5);

        // Retrieve the score from local storage
        this.score = localStorage.getItem('gameScore') || 0;

         // Display game over scene elements
         var scoreText = game.add.text(game.world.centerX, game.world.centerY - 50, 'Score: ' + this.score, { font: '32px Arial', fill: '#fff' });
         scoreText.anchor.setTo(0.5);
 
         var restartButton = game.add.button(game.world.centerX, game.world.centerY + 50, 'restartButton', this.restartGame, this);
         restartButton.anchor.setTo(0.5);
    },


    restartGame: function() {
        // Transition to the game start scene
        game.state.start('GameStart');
    }
};

// Add the game states
game.state.add('GameStart', GameStart);
game.state.add('Instructions', Instructions);
game.state.add('GamePlay', GamePlay);
game.state.add('GameOver', GameOver);

// Start with the game start scene
game.state.start('GameStart');
