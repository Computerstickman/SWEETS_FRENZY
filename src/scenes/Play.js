class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.spritesheet('pinkie', './assets/pinksheet.png', {frameWidth: 1306, frameHeight: 442, startFrame: 0, endFrame: 3});
        this.load.image('tounge', './assets/tounge.png');
        this.load.image('overlay', './assets/pink0.png');
        this.load.image('hooves', './assets/hooves.png');
        this.load.image('muffin', './assets/muffin.png');
        this.load.image('cupcake', './assets/cupcake.png');
        this.load.image('special', './assets/specialcake.png');
        this.load.image('counter', './assets/counter.png');
        this.load.audio('sfx_select', './assets/blip_select12.wav');
    }

    create() {


        this.pinkie = new Rocket(this, game.config.width/2, game.config.height - borderUISize, 'pinkie').setOrigin(0.5, 1).setDisplaySize(350, 120);
        this.tounge = new Tounge(this, game.config.width/2, game.config.height - borderUISize, 'tounge').setOrigin(0.5, 0);

        this.muffin = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'muffin', 0, 30).setOrigin(0, 0);
        this.cupcake = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'cupcake', 0, 20).setOrigin(0,0);
        this.specialcake = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'special', 0, 10).setOrigin(0,0);

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);

        this.overlay = this.add.image(game.config.width/2, game.config.height - borderUISize, 'overlay').setOrigin(0.5, 1).setDisplaySize(350, 120).setAlpha(0);
        this.hooves = new Rocket(this, game.config.width/2, game.config.height - borderUISize, 'hooves').setOrigin(0.5, 0.6).setDisplaySize(350, 120);

        this.counter = this.add.image(0, game.config.height, 'counter').setOrigin(0, 1).setDisplaySize(160, 100);
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);


        // initialize score
        this.p1Score = 0;
        this.isFiring = false;
        this.isAnimating = false;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#FEE5B4',
            color: '#E44898',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 90
        }
        this.scoreLeft = this.add.text(20, game.config.height - borderUISize, this.p1Score, scoreConfig);

        // GAME OVER flag
        this.gameOver = false;

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('pinkie', { start: 0, end: 0, first: 0}),
            frameRate: 1
        });
        this.anims.create({
            key: 'tounge',
            frames: this.anims.generateFrameNumbers('pinkie', { start: 1, end: 1, first: 1}),
            frameRate: 1
        });
        this.anims.create({
            key: 'bad',
            frames: this.anims.generateFrameNumbers('pinkie', { start: 2, end: 2, first: 2}),
            frameRate: 1
        });
        this.anims.create({
            key: 'good',
            frames: this.anims.generateFrameNumbers('pinkie', { start: 3, end: 3, first: 3}),
            frameRate: 1
        });

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← to Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
            this.isAnimating = true;
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
            

            if(keyLEFT.isDown && this.pinkie.x >= 0 + 150 && !this.isFiring && !this.isAnimating) {
                this.pinkie.x -= 2;
                this.hooves.x -= 2;
                this.tounge.x -= 2;
            } else if (keyRIGHT.isDown && this.pinkie.x <= game.config.width - 150 && !this.isFiring && !this.isAnimating) {
                this.pinkie.x += 2;
                this.hooves.x += 2;
                this.tounge.x += 2;
            }

            if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring && !this.isAnimating)
            {
                this.isFiring = true;
                this.sound.play('sfx_select'); 
                this.overlay.setX (this.pinkie.x);
                this.overlay.setAlpha(1);
                this.pinkie.anims.play('tounge'); 
            }

            if(this.tounge.y <= 0) {
                this.tounge.y = game.config.width/2, game.config.height - borderUISize;
                this.pinkie.anims.play('bad'); 
                this.isAnimating = true;
                this.clock = this.time.delayedCall(800, () => {
                    this.pinkie.anims.play('idle'); 
                    this.isAnimating = false;
                }, null, this);
                this.isFiring = false;
                this.overlay.setAlpha(0);
            }

            if(this.isFiring) {
                this.tounge.y -= 4;
            }

        
        if(!this.gameOver) {
            this.pinkie.update(); 
            this.hooves.update();
            //this.tounge.update();                           
            this.muffin.update();
            this.cupcake.update();
            this.specialcake.update();
        }
        

        
        if(this.checkCollision(this.tounge, this.muffin)) {
            this.p1Score += 5;
            this.reset();
            //this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.tounge, this.cupcake)) {
            this.p1Score += 10;
            this.reset();
           // this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.tounge, this.specialcake)) {
            this.p1Score += 20;
            this.reset();
            //this.shipExplode(this.ship01);
        }
        
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

    reset()
    {
        this.tounge.y = game.config.width/2, game.config.height - borderUISize;
        this.pinkie.anims.play('good'); 
        this.isAnimating = true;
        this.clock = this.time.delayedCall(500, () => {
            this.pinkie.anims.play('idle'); 
            this.isAnimating = false;
            this.scoreLeft.text = this.p1Score; 
        }, null, this);
        this.isFiring = false;
        this.overlay.setAlpha(0);
    }
}