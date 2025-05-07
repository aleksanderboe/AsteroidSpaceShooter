import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {}

  preload() {
    this.load.setPath("assets");

    // Load player ship
    this.load.image("playerShip1_red", "playerShip1_red.png");
  }

  create() {
    this.scene.start("Game");
  }
}
