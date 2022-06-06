/*
Stell Paicos - SWEETS FRENZY! - about two days

Points-

-60 in S tier, redesigned all artwork, UI and sound for a cute aesthetic
-20 in Intermiediate for new spaceship type (the specialcake, one with stars)
-20 in Intermediate for new weapon (tounge)
-5 in Starting for randomizing movement (in this case spawn location for cakes)

Most help was gotten from the phaser page itself/documentation :)

*/


let config = {
    type: Phaser.CANVAS,
    autoCenter: true,
    width: 1000,
    height: 500,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard variables
let keyUP, keyR, keyLEFT, keyRIGHT;