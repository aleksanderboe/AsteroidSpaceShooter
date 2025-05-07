import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {}

  preload() {
    this.load.setPath("assets");

    this.load.image("playerShip1_red", "playerShip1_red.png");
    this.load.image("laserRed16", "laserRed16.png");

    this.load.audio("laser", "sfx_laser1.ogg");
  }

  create() {
    this.scene.start("Game");
  }
}
