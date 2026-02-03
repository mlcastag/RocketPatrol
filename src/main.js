// Matt Castagna
// Rocket Patrol 2 Electric Boogaloo
// X Hours
// High Score (1 point), alternating 2 player mode (5), Display time remaining (3), 
// Timer that adds and subtracts (5), Increase speed after 30 sec (1), 
// 4 new explosion (3), 'FIRE!' text when shooting (1), Background music (1)
// Sources: background music: https://www.youtube.com/watch?v=T0CeNCfWIH0&list=PLfP6i5T0-DkLrHqanmCrOs28G-WDHgZzN&index=1
// 



let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config)
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3
let keyFIRE, keyRESET, keyLEFT, keyRIGHT, keyUP

game.highScore = 0
game.turn = 1
game.twoPlayer = 1