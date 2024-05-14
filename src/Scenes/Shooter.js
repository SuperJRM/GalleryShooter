class Shooter extends Phaser.Scene {
    constructor() {
        super("shooter");

        // Initialize a class variable "my" which is an object.
        // The object has two properties, both of which are objects
        //  - "sprite" holds bindings (pointers) to created sprites
        //  - "text"   holds bindings to created bitmap text objects
        this.my = {sprite: {}, text: {}};

        this.my.sprite.bullet = [];   
        this.maxBullets = 1;           // Don't create more than this many bullets

        this.jetSpeed = 3;
        this.bulletSpeed = 15;
        
        this.my.sprite.enemy = [];

        this.currScore = 0; 

        this.enemyY = [game.config.height/2, game.config.height/2+100, game.config.height/2+200, game.config.height/2-100, game.config.height/2-200]
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("jet", "tile_0154.png");
        this.load.image("bullet", "tile_0191.png");
        this.load.image("enemy", "tile_0138.png");
    }

    create() {
        let my = this.my;

        my.sprite.jet = this.add.sprite(game.config.width-900, game.config.height/2, "jet");
        my.sprite.jet.setScale(5);

        for (var i = 0; i < this.enemyY.length; i++) {
            my.sprite.enemy.push(this.add.sprite(
                900, this.enemyY[i], "enemy").setScale(3)
            )
        }

        this.up = this.input.keyboard.addKey("W");
        this.down = this.input.keyboard.addKey("S");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Set movement speeds (in pixels/tick)
        
    }

    update() {
        let my = this.my;

        // Moving left
        if (this.up.isDown) {
            // Check to make sure the sprite can actually move left
            if (my.sprite.jet.y > (25+my.sprite.jet.displayHeight/2)) {
                my.sprite.jet.y -= this.jetSpeed;
            }
        }

        // Moving right
        if (this.down.isDown) {
            // Check to make sure the sprite can actually move right
            if (my.sprite.jet.y < (game.config.height - (my.sprite.jet.displayHeight/2))) {
                my.sprite.jet.y += this.jetSpeed;
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            // Are we under our bullet quota?
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
                    // start animation
                    //this.puff = this.add.sprite(my.sprite.hippo.x, my.sprite.hippo.y, "whitePuff03").setScale(0.25).play("puff");
                    // clear out bullet -- put y offscreen, will get reaped next update
                    bullet.x = 1100;
                    enemy.visible = false;
                    enemy.x = 1100;
                    // Update score
                    //this.myScore += my.sprite.hippo.scorePoints;
                    //this.updateScore();
                    // Play sound
                    //this.sound.play("dadada", {
                    //    volume: 1   // Can adjust volume using this, goes from 0 to 1
                    //});
                    // Have new hippo appear after end of animation
                    /*this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                        this.my.sprite.hippo.visible = true;
                        this.my.sprite.hippo.x = Math.random()*config.width;
                    }, this);*/
                };

            };
        };

        this.levelFlag = false;
        for (let enemy of my.sprite.enemy) {
            if (enemy.visible == true) {
                this.levelFlag = true;
            };
        };
        if (this.levelFlag == false) {
            console.log("Yippee!!!");
        };

        for (let bullet of my.sprite.bullet) {
            bullet.x += this.bulletSpeed;
        }
    }

    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }
}