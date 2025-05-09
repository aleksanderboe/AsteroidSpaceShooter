import { Scene } from "phaser";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  spawnMeteor() {
    const meteor = this.meteors.get();
    if (meteor) {
      meteor.setTexture("meteor");
      const texture = this.textures.get("meteor");
      const width = texture.getSourceImage().width;
      const height = texture.getSourceImage().height;
      meteor.body.setSize(width, height);

      meteor.isDestroyed = false;
      meteor.setActive(true);
      meteor.setVisible(true);
      meteor.setBounce(1);
      meteor.setMass(1);

      const gameWidth = this.cameras.main.width;
      const gameHeight = this.cameras.main.height;
      const side = Phaser.Math.Between(0, 3);
      let x, y;

      if (side === 0) {
        // Top
        x = Phaser.Math.Between(0, gameWidth);
        y = 0;
      } else if (side === 1) {
        // Right
        x = gameWidth;
        y = Phaser.Math.Between(0, gameHeight);
      } else if (side === 2) {
        // Bottom
        x = Phaser.Math.Between(0, gameWidth);
        y = gameHeight;
      } else {
        // Left
        x = 0;
        y = Phaser.Math.Between(0, gameHeight);
      }

      meteor.setPosition(x, y);

      const centerX = gameWidth / 2;
      const centerY = gameHeight / 2;
      const angleToCenter = Phaser.Math.Angle.Between(x, y, centerX, centerY);
      const speed = Phaser.Math.Between(100, 300);
      const velocityX = Math.cos(angleToCenter) * speed;
      const velocityY = Math.sin(angleToCenter) * speed;
      meteor.setVelocity(velocityX, velocityY);
    }
  }

  destroyAllMeteors() {
    this.meteors.getChildren().forEach((meteor) => {
      if (meteor.active) {
        meteor.isDestroyed = true;
        meteor.setActive(false);
        meteor.setVisible(false);
      }
    });
  }

  shootLaser() {
    const laser = this.lasers.get();
    if (laser) {
      this.laserSound.play();

      const rotation = this.player.rotation - Math.PI / 2;
      const x = this.player.x + Math.cos(rotation) * 40;
      const y = this.player.y + Math.sin(rotation) * 40;

      laser.setTexture("laserRed16");
      laser.setPosition(x, y);
      laser.setRotation(rotation + Math.PI / 2);
      laser.setActive(true);
      laser.setVisible(true);

      const velocityX = Math.cos(rotation) * 400;
      const velocityY = Math.sin(rotation) * 400;
      laser.setVelocity(velocityX, velocityY);

      const laserExpireMs = 1000;

      this.time.delayedCall(laserExpireMs, () => {
        laser.setActive(false);
        laser.setVisible(false);
      });
    }
  }

  update() {
    // Rotation
    if (this.cursors.left.isDown) {
      this.player.setAngularVelocity(-this.rotationSpeed);
    } else if (this.cursors.right.isDown) {
      this.player.setAngularVelocity(this.rotationSpeed);
    } else {
      this.player.setAngularVelocity(0);
    }

    // Acceleration
    if (this.cursors.up.isDown) {
      const rotation = this.player.rotation - Math.PI / 2;

      const accelerationX = Math.cos(rotation) * this.acceleration;
      const accelerationY = Math.sin(rotation) * this.acceleration;

      this.player.setAcceleration(accelerationX, accelerationY);
    } else {
      this.player.setAcceleration(0, 0);
    }

    if (!this.cursors.up.isDown) {
      this.player.setDrag(0.4);
    }

    // Shooting
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.shootLaser();
    }
  }

  updateScore() {
    this.score += 10;
    this.scoreText.setText(`Score: ${this.score}`);
  }

  resetScore() {
    this.score = 0;
    this.scoreText.setText(`Score: ${this.score}`);
  }

  create() {
    this.cameras.main.setBackgroundColor(0x000000);

    this.createScore();
    this.createPlayer();
    this.createLaser();
    this.createMeteor();

    this.createColliders();

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    const meteorSpawnCooldownMS = 2000;
    this.time.addEvent({
      delay: meteorSpawnCooldownMS,
      callback: this.spawnMeteor,
      callbackScope: this,
      loop: true,
    });
  }

  createScore() {
    this.score = 0;

    const x = this.cameras.main.width / 2;

    this.scoreText = this.add
      .text(x, 50, `Score: ${this.score}`, {
        fontFamily: "Arial",
        fontSize: "32px",
        color: "#ffffff",
        align: "left",
      })
      .setOrigin(0.5, 0.5);
  }

  createPlayer() {
    // Player
    this.player = this.physics.add.sprite(400, 300, "playerShip1_red");
    this.player.setOrigin(0.5);

    this.player.setRotation(-Math.PI / 2);

    this.player.setDamping(true);
    this.player.setDrag(0.4);
    this.player.setMaxVelocity(300);
    this.player.setAngularDrag(400);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.acceleration = 200;
    this.rotationSpeed = 200;
  }

  createLaser() {
    this.lasers = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 10,
    });

    this.laserSound = this.sound.add("laser");
  }

  createMeteor() {
    this.meteors = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 10,
    });

    this.meteorHitSound = this.sound.add("zap");
  }

  createColliders() {
    // Player <-> Meteor
    this.physics.add.overlap(this.player, this.meteors, (player, meteor) => {
      this.player.setPosition(400, 300);
      this.player.setVelocity(0, 0);
      this.player.setAcceleration(0, 0);
      this.player.setAngularVelocity(0);
      this.player.setRotation(-Math.PI / 2);
      this.destroyAllMeteors();

      this.resetScore();
    });

    // Laser <-> Meteor
    this.physics.add.collider(this.meteors, this.lasers, (meteor, laser) => {
      if (!meteor.isDestroyed) {
        meteor.isDestroyed = true;
        meteor.setActive(false);
        meteor.setVisible(false);
        laser.setActive(false);
        laser.setVisible(false);
        this.meteorHitSound.play();
        this.updateScore();
      }
    });
  }
}
