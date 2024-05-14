// Jason Rangel-Martinez
// Created: 5/8/2024
// Phaser: 3.70.0
// 
// Art assets from Kenny Assets "Tiny Battle" set:
// https://kenney.nl/assets/tiny-battle

// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    width: 1000,
    height: 800,
    scene: [Shooter],
    fps: { forceSetTimeOut: true, target: 60 }
}

// Global variable to hold sprites
var my = {sprite: {}, text: {}};

const game = new Phaser.Game(config);
