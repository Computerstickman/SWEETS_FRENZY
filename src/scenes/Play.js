class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('pinkidle', './assets/pink1.png');
        this.load.image('tounge', './assets/tounge.png');
        this.load.image('hooves', './assets/hooves.png');
        this.load.image('muffin', './assets/muffin.png');
        this.load.image('cupcake', './assets/cupcake.png');
        this.load.image('special', './assets/specialcake.png');
    }

    create() {


        this.pinkie = new Rocket(this, game.config.width/2, game.config.height - borderUISize, 'pinkidle').setOrigin(0.5, 1).setDisplaySize(350, 120);
        this.tounge = new Tounge(this, game.config.width/2, game.config.height - borderUISize, 'tounge').setOrigin(0.5, 0);

        this.muffin = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'muffin', 0, 30).setOrigin(0, 0);
        this.cupcake = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'cupcake', 0, 20).setOrigin(0,0);
        this.specialcake = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'special', 0, 10).setOrigin(0,0);

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);

        this.hooves = new Rocket(this, game.config.width/2, game.config.height - borderUISize, 'hooves').setOrigin(0.5, 0.5).setDisplaySize(350, 120);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);


        // initialize score
        this.p1Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← to Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() {
        // check key input for restart / menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }


            if(keyLEFT.isDown && this.pinkie.x >= 0 + borderUISize) {
                this.pinkie.x -= 2;
                this.hooves.x -= 2;
                this.tounge.x -= 2;
            } else if (keyRIGHT.isDown && this.pinkie.x <= game.config.width - borderUISize) {
                this.pinkie.x += 2;
                this.hooves.x += 2;
                this.tounge.x += 2;
            }
        
        if(!this.gameOver) {
            this.pinkie.update(); 
            this.hooves.update();
            this.tounge.update();                           
            this.muffin.update();
            this.cupcake.update();
            this.specialcake.update();
        }
        

        /*
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        */
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

  
}