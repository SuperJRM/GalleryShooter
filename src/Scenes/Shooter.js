class Shooter extends Phaser.Scene {
    constructor() {
        super("shooter");

        this.my = {sprite: {}, text: {}};

        this.my.sprite.bullet = [];   
        this.maxBullets = 1;          

        this.my.sprite.health = [];

        this.jetSpeed = 3;
        this.bulletSpeed = 15;
        
        this.my.sprite.enemy = [];
        this.my.sprite.eBullet = [];   
        this.maxEBullets = 3;

        this.currScore = 0; 

        this.enemyY = [game.config.height/2, game.config.height/2+100, game.config.height/2+200, game.config.height/2-100, game.config.height/2-200]
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("jet", "tile_0154.png");
        this.load.image("bullet", "tile_0191.png");
        this.load.image("eBullet", "tile_0191.png");
        this.load.image("enemy", "tile_0138.png");
        this.load.image("jHealth", "tile_0192.png");
    }

    create() {
        let my = this.my;

        my.sprite.jet = this.add.sprite(game.config.width-900, game.config.height/2, "jet");
        my.sprite.jet.setScale(5);
        my.sprite.jet.lives = 3;

        this.updateLives();

        for (var i = 0; i < this.enemyY.length; i++) {
            my.sprite.enemy.push(this.add.sprite(
                900, this.enemyY[i], "enemy").setScale(3)
            );
        };
        my.sprite.enemy.points = 100;

        this.up = this.input.keyboard.addKey("W");
        this.down = this.input.keyboard.addKey("S");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.add.text(790, 760, "Lives: ", {
            fontFamily: 'Times, serif',
            fontSize: 24,
            wordWrap: {
                width: 60
            }
        });

        my.text.sText = this.add.text(790, 10, 'Score: ' + this.currScore, {
            fontFamily: 'Times, serif',
            fontSize: 24
        });
    }

    update() {
        let my = this.my;

        //Movement
        if (this.up.isDown) {
            if (my.sprite.jet.y > (25+my.sprite.jet.displayHeight/2)) {
                my.sprite.jet.y -= this.jetSpeed;
            }
        }

        if (this.down.isDown) {
            if (my.sprite.jet.y < (game.config.height - (my.sprite.jet.displayHeight/2))) {
                my.sprite.jet.y += this.jetSpeed;
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            if (my.sprite.bullet.length < this.maxBullets) {
                my.sprite.bullet.push(this.add.sprite(
                    my.sprite.jet.x + (my.sprite.jet.displayWidth/2), my.sprite.jet.y, "bullet").setScale(3)
                );
            }
        }

        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.x < 1005);

        for (let bullet of my.sprite.bullet) {
            for(let enemy of my.sprite.enemy) {
                if (this.collides(enemy, bullet)) {
                    bullet.x = 1100;
                    enemy.visible = false;
                    enemy.x += 1000;
                    this.currScore += my.sprite.enemy.points;
                    if (this.currScore%10000 == 0) {
                        my.sprite.jet.lives++;
                    }
                    this.updateText();
                };

            };
        };
        
        for (let enemy of my.sprite.enemy) {
            if (my.sprite.eBullet.length < this.maxEBullets && enemy.visible == true) {
                if ((Math.floor(Math.random()*750)) < 1) {
                    my.sprite.eBullet.push(this.add.sprite(
                        enemy.x - (enemy.displayWidth/2), enemy.y, "eBullet").setScale(3)
                    );
                }
            }
        }

        my.sprite.eBullet = my.sprite.eBullet.filter((eBullet) => eBullet.x > -10);

        for (let eBullet of my.sprite.eBullet) {
            if (this.collides(my.sprite.jet, eBullet)) {
                eBullet.x = -100;
                my.sprite.jet.visible = false;
                my.sprite.jet.x -= 100;
                my.sprite.jet.lives--;
                my.sprite.health.pop();
                if (my.sprite.jet.lives <= 0) {
                    my.sprite.jet.lives = 3;
                    this.currScore = 0; 
                };
                my.sprite.jet.visible = true;
                my.sprite.jet.x += 100;
                this.updateText();
                };

            };

        this.levelFlag = false;
        for (let enemy of my.sprite.enemy) {
            if (enemy.visible == true) {
                this.levelFlag = true;
            };
        };
        if (this.levelFlag == false) {
            for (let enemy of my.sprite.enemy) {
                enemy.x -= 1000;
                enemy.visible = true;
            };
        };

        for (let bullet of my.sprite.bullet) {
            bullet.x += this.bulletSpeed;
        };

        for (let eBullet of my.sprite.eBullet) {
            eBullet.x -= this.bulletSpeed/2;
        };
    };

    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    };

    updateText() {
        let my = this.my;
        my.text.sText.setText("Score: " + this.currScore);
    };

    updateLives() {
        let my = this.my;
        for (var i = 0; i < my.sprite.jet.lives; i++) {
            my.sprite.health.push(this.add.sprite(
                875+i*30, 770, "jHealth").setScale(3)
            );
        };
    }
}