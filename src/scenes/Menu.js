class Menu extends Phaser.Scene{
    constructor(){
        super("menuScene")
    }

    preload(){
        this.load.image('rocket', './assets/rocket.png')
        this.load.image('spaceship', './assets/spaceship.png')
        this.load.image('starfield', './assets/starfield.png')

        this.load.spritesheet('explosion', './assets/explosion.png', {
            frameWidth: 64,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 9
        })

        this.load.audio('sfx-select', './assets/sfx-select.wav')
        this.load.audio('sfx-explosion', './assets/sfx-explosion.wav')
        this.load.audio('sfx-shot', './assets/sfx-shot.wav')
        this.load.audio('newexplosion1', './assets/newexplosion1.wav')
        this.load.audio('newexplosion2', './assets/newexplosion2.wav')
        this.load.audio('newexplosion3', './assets/newexplosion3.wav')
        this.load.audio('newexplosion4', './assets/newexplosion4.wav')
        this.load.audio('arthur-vyncke-a-few-jumps-away', './assets/arthur-vyncke-a-few-jumps-away.mp3')
    }

    create(){
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        })
        
        let menuConfig = {
          fontFamily: 'Courier',
          fontSize: '28px',
          backgroundColor: '#F3B141',
          color: '#843605',
          align: 'right',
          padding: {
              top: 5,
              bottom: 5,
            },
           
           fixedWidth: 0
        }
        

        this.add.text(game.config.width/2,game.config.height/2 - borderUISize - borderPadding, 'ROCKET PATROL', menuConfig).setOrigin(0.5)
        this.add.text(game.config.width/2, game.config.height/2, 'Use arrows to move F to fire', menuConfig).setOrigin(0.5)
        menuConfig.backgroundColor = '#00ff00'
        menuConfig.color = '#000'
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'press <- for novice or -> for expert', menuConfig).setOrigin(0.5)
        this.add.text(game.config.width/2, game.config.height/1.7 + borderUISize + borderPadding, '^ for 2 player mode', menuConfig).setOrigin(0.5)
        this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, 'High Score: ' + game.highScore, menuConfig)
    
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            game.settings = {
            spaceshipSpeed: 3,
            gameTimer: 60000    
        }
        this.sound.play('sfx-select')
        this.scene.start('playScene')    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            game.settings = {
            spaceshipSpeed: 4,
            gameTimer: 45000    
        }
        this.sound.play('sfx-select')
        this.scene.start('playScene')    
        }
        if (Phaser.Input.Keyboard.JustDown(keyUP)) {
            game.settings = {
            spaceshipSpeed: 3,
            gameTimer: 60000
        }
        game.twoPlayer = 2
        this.sound.play('sfx-select')
        this.scene.start('playScene')    
        }
               

    }
}