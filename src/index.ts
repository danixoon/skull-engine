import { GameEngine } from "./engine/engine";
import { GameController } from "./game";

const getSize = (pixelScale: number) => {
  const maxW = window.innerWidth / pixelScale;
  const maxH = window.innerHeight / pixelScale;
  const width = maxW - (maxW % pixelScale);
  const height = maxH - (maxH % pixelScale);

  return { width, height };
};

const init = () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  if (!canvas) throw new Error("canvas not found");
  const pixelScale = 4;

  const setGameWindowSize = () => {
    const { width, height } = getSize(pixelScale);
    canvas.setAttribute("style", `width: ${width * pixelScale}px; height: ${height * pixelScale}px`);
    canvas.width = width;
    canvas.height = height;
  };

  const engine = new GameEngine(canvas);
  const controller = engine.createObject(GameController);

  engine.init({ smoothImage: false, scale: pixelScale });

  setGameWindowSize();
  window.addEventListener("resize", e => setGameWindowSize());
};

// Запуск приложения
document.addEventListener("DOMContentLoaded", () => init());
