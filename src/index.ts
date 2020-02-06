import { start as startKnightDemo } from "./demo/knight";
import { start as startBallDemo } from "./demo/ball";
import { GameEngine } from "./engine/engine";

const getSize = (pixelScale: number) => {
  const maxW = window.innerWidth / pixelScale;
  const maxH = window.innerHeight / pixelScale;
  const width = maxW - (maxW % pixelScale);
  const height = maxH - (maxH % pixelScale);

  return { width, height };
};

export const init = () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  if (!canvas) throw new Error("canvas not found");
  // const pixelScale = 4;

  const engine = new GameEngine(canvas);
  const pixelScale = startBallDemo(engine);

  const setGameWindowSize = () => {
    const { width, height } = getSize(pixelScale);
    canvas.setAttribute("style", `width: ${width * pixelScale}px; height: ${height * pixelScale}px`);
    canvas.width = width;
    canvas.height = height;
  };

  setGameWindowSize();
  window.addEventListener("resize", e => setGameWindowSize());
};

// Запуск приложения
document.addEventListener("DOMContentLoaded", () => init());
