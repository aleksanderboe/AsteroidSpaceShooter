import { Scene } from "phaser";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  create() {
    this.cameras.main.setBackgroundColor(0x000000);

    this.player = this.physics.add.sprite(400, 300, "playerShip1_red");
    this.player.setOrigin(0.5);

    this.player.setRotation(-Math.PI / 2); // -90 degrees in radians

    this.player.setDamping(true);
    this.player.setDrag(0.95);
    this.player.setMaxVelocity(300);
    this.player.setAngularDrag(400);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.acceleration = 200;
    this.rotationSpeed = 200;

    this.cursors = this.input.keyboard.createCursorKeys();
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
      this.player.setDrag(0.95);
    }
  }
}
