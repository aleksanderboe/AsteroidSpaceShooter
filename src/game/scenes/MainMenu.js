import { Scene } from "phaser";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add
      .text(width / 2, height / 3, "MAIN MENU", {
        fontFamily: "Arial Black",
        fontSize: 64,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: "#000",
          blur: 2,
          stroke: true,
          fill: true,
        },
      })
      .setOrigin(0.5);

    const button = this.add
      .rectangle(width / 2, height / 2, 300, 80, 0x2ecc71)
      .setInteractive()
      .setOrigin(0.5)
      .setStrokeStyle(4, 0xffffff);

    const buttonText = this.add
      .text(width / 2, height / 2, "PLAY GAME", {
        fontFamily: "Arial Black",
        fontSize: 32,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 6,
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: "#000",
          blur: 2,
          stroke: true,
          fill: true,
        },
      })
      .setOrigin(0.5);

    // hover effects
    button.on("pointerover", () => {
      button.setFillStyle(0x27ae60);
      button.setStrokeStyle(4, 0xffffff, 0.8);
      buttonText.setScale(1.05);
    });

    button.on("pointerout", () => {
      button.setFillStyle(0x2ecc71);
      button.setStrokeStyle(4, 0xffffff);
      buttonText.setScale(1);
    });

    // click effect
    button.on("pointerdown", () => {
      button.setFillStyle(0x219a52);
      buttonText.setScale(0.95);
    });

    // start game on press
    button.on("pointerup", () => {
      button.setFillStyle(0x27ae60);
      buttonText.setScale(1.05);
      this.scene.start("Game");
    });
  }
}
