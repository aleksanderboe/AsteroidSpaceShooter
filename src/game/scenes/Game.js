import { Scene } from "phaser";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  create() {
    this.cameras.main.setBackgroundColor(0x000000);

    // Laser
    this.lasers = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 10,
    });

    this.laserSound = this.sound.add("laser");

    // Meteor
    this.meteors = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 10,
    });

    this.meteorHitSound = this.sound.add("zap");

    const meteor = this.meteors.get();
    if (meteor) {
      meteor.setTexture("meteor");
      meteor.setPosition(200, 200);
      meteor.setActive(true);
      meteor.setVisible(true);

      const texture = this.textures.get("meteor");
      const width = texture.getSourceImage().width;
      const height = texture.getSourceImage().height;
      meteor.body.setSize(width, height);

      meteor.isDestroyed = false;
    }

    this.physics.add.collider(this.meteors, this.lasers, (meteor, laser) => {
      if (!meteor.isDestroyed) {
        meteor.isDestroyed = true;
        meteor.setActive(false);
        meteor.setVisible(false);
        laser.setActive(false);
        laser.setVisible(false);
        this.meteorHitSound.play();
      }
    });

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

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
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
}
