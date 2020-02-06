import { GameEngine } from "../../engine/engine";
import { GameController } from "./game";

export const start = (engine: GameEngine) => {
  const pixelScale = 4;
  const controller = engine.createObject(GameController);
  engine.init({ smoothImage: false, scale: pixelScale });

  return pixelScale;
};
