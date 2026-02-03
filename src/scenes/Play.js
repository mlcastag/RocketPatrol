class Play extends Phaser.Scene{
    constructor(){
        super('playScene')
    }

    create(){
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0,0)
        this.ludacrisSpeed = false
        this.ambiance = this.sound.add('arthur-vyncke-a-few-jumps-away', {
            volume: 0.2,
            loop: true
        })
        this.ambiance.play()

        this.bigBooms = ['sfx-explosion', 'newexplosion1', 'newexplosion2', 'newexplosion3', 'newexplosion4']

        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0,0)
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)

        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5,0)

        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)

       this.ship01 = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4, 'spaceship', 0, 30).setOrigin(0,0)
       this.ship02 = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'spaceship', 0, 20).setOrigin(0,0)
       this.ship03 = new Spaceship(this, game.config.width, borderUISize * 6 + borderPadding * 4, 'spaceship', 0, 10).setOrigin(0,0)

        this.p1Score = 0

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
        let playerConfig = {
          fontFamily: 'Courier',
          fontSize: '28px',
          backgroundColor: '#F3B141',
          color: '#843605',
          align: 'left',
          padding: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 150
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig)
        this.playerTurn = this.add.text(borderUISize + borderPadding * 37, borderUISize + borderPadding*2, 'Player: ' + game.turn, playerConfig)
        this.timer = this.add.text(borderUISize + borderPadding * 15, borderUISize + borderPadding*2, '', {...playerConfig, fixedWidth: 35})
        this.fireText = this.add.text(borderUISize + borderPadding * 25, borderUISize + borderPadding*2, 'FIRE!', {...playerConfig, fixedWidth: 80})
        this.fireText.setVisible(false)
        this.gameOver = false

        scoreConfig.fixedWidth = 0
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            if(this.p1Score > game.highScore){
                game.highScore = this.p1Score
            }
            if(game.turn == 1 && game.twoPlayer == 2){
                this.add.text(game.config.width/2, game.config.height/2 - 64, 'PRESS RESET FOR PLAYER 2', scoreConfig).setOrigin(0.5)
            }
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5)
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5)
            this.gameOver = true
        }, null, this)
   
    }

    update(){ 
        let timeLeft = Math.round(this.clock.getRemaining() / 1000)
        
        if(!this.gameOver){
            this.timer.text = timeLeft
        }

        if(!this.ludacrisSpeed && timeLeft <= (game.settings.gameTimer / 1000) - 30){
            this.ludacrisSpeed = true
            this.ship01.moveSpeed *= 2
            this.ship02.moveSpeed *= 2
            this.ship03.moveSpeed *= 2
        } 
        
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)){
            if(game.turn == 1 && game.twoPlayer == 2){
                game.turn = 2
                this.scene.restart()
            }else if(game.turn == 2  || game.twoPlayer == 1){
                game.turn = 1
                this.scene.restart()
            }
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene")
        }
        
        this.starfield.tilePositionX -= 4

        if(this.p1Rocket.isFiring){
            this.fireText.setVisible(true)
        }else{
            this.fireText.setVisible(false)
        }

        if(!this.gameOver){
            this.p1Rocket.update()
            this.ship01.update()
            this.ship02.update()
            this.ship03.update()
        } 

        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship03)
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship02)
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship01)
        }
        if(this.p1Rocket.y <= borderUISize * 3 + borderPadding){
            this.p1Rocket.reset()
            this.clock.elapsed += 5000
        }
        
    }

    checkCollision(rocket, ship) {
        if (rocket.x < ship.x + ship.width && 
        rocket.x + rocket.width > ship.x && 
        rocket.y < ship.y + ship.height &&
        rocket.height + rocket.y > ship. y) {
            return true
        } else {
            return false
        }
    }

    shipExplode(ship){
        ship.alpha = 0
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0,0);
        boom.anims.play('explode')
        boom.on('animationcomplete', () => {
            ship.reset()
            ship.alpha = 1
            boom.destroy()
        })
        this.p1Score += ship.points
        this.scoreLeft.text = this.p1Score
        this.clock.elapsed -= 5000 
        this.sound.play(this.bigBooms[Phaser.Math.Between(0, this.bigBooms.length - 1)])
    }

}