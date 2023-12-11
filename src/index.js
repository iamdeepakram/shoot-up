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
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-container');

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
var GamePlay = function(game) {};

GamePlay.prototype = {
    preload: function() {
        // Load assets for the game play scene
        // InstructionScreen.png
    },

    create: function() {
        // Initialize game play elements
        // Example: this.player = game.add.sprite(100, 100, 'player');
    },

    update: function() {
        // Update game play logic
    }
};

// Game over scene
var GameOver = function(game) {};

GameOver.prototype = {
    preload: function() {
        // Load assets for the game over scene
    },

    create: function() {
        // Display game over scene elements
        // Example: this.gameOverText = game.add.text(game.world.centerX, game.world.centerY, 'Game Over', { font: '32px Arial', fill: '#fff' });
        // this.gameOverText.anchor.setTo(0.5);
        // Add any game over scene functionality
        // Example: this.restartButton = game.add.button(game.world.centerX, game.world.centerY + 50, 'restartButton', this.restartGame, this);
        // this.restartButton.anchor.setTo(0.5);
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
