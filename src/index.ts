import { GameEngine } from "./engine.js";
import { addVector, Vector, multVector, normalizeVector, lerpVector } from "./helpers.js";
import { GameObject } from "./gameObject.js";
import { ShapeComponent, GameComponent, SpriteComponent, AnimatorComponent } from "./components/index.js";

class Player extends GameObject {
  //@ts-ignore
  sprite: SpriteComponent;
  //@ts-ignore
  anim: AnimatorComponent;
  speed = 1.5;
  angle = 0;
  onStart = () => {
    this.sprite = this.addComponent(SpriteComponent);
    this.anim = this.addComponent(AnimatorComponent);
    this.sprite.setProps({ atlas: [16, 16], animSpeed: 0.3 });
    this.anim.setProps({
      sprite: this.sprite,
      animations: new Map([
        ["idle", GameEngine.loadImage("knight_idle_spritesheet.png")],
        ["run", GameEngine.loadImage("knight_run_spritesheet.png")]
      ])
    });
  };
  onUpdate = (delta: number) => {
    const { engine } = this;
    const { camera, input } = engine;

    const horAxis = input.isKeyPress("KeyD") ? 1 : input.isKeyPress("KeyA") ? -1 : 0;
    const verAxis = input.isKeyPress("KeyS") ? 1 : input.isKeyPress("KeyW") ? -1 : 0;

    const normAxis = normalizeVector([horAxis, verAxis]);
    this.position = addVector(this.position, multVector(normAxis, this.speed));
    if (horAxis !== 0 || verAxis !== 0) {
      this.anim.setAnimation("run");
    } else {
      this.anim.setAnimation("idle");
    }
    if (horAxis !== 0) {
      this.scale = [Math.abs(this.scale[0]) * horAxis, 1];
    }

    const offset = 32;
    const [x, y] = this.position;
    const [cx, cy] = camera.position;
    const dx = x - cx,
      dy = y - cy;

    let camPos: Vector = [cx, cy];

    if (Math.abs(dx) > offset) camPos = [x - Math.sign(dx) * offset, camPos[1]];
    if (Math.abs(dy) > offset) camPos = [camPos[0], y - Math.sign(dy) * offset];

    // camera.position = lerpVector(camera.position, camPos, 0.05);
    camera.position = camPos;
  };
}

class PlayerSword extends GameObject {
  sortLayer = -1;
  onStart = () => {
    this.addComponent(SpriteComponent).setProps({ sprite: GameEngine.loadImage("weapon_sword_1.png") });
  };
}

class GameController extends GameObject {
  onStart = () => {
    const { engine } = this;
    const [x, y] = [engine.ctx.canvas.width / 2, engine.ctx.canvas.height / 2];
    const player = engine.createObject(Player, { position: [x, y] as Vector });
    const sword = engine.createObject(PlayerSword, { position: [8, 0] as Vector });
    const barrel = engine.createObject(Barrel, { position: [x + 32, y - 32] as Vector });

    engine.setParent(sword, player);
  };
  onUpdate = () => {
    // if (this.engine.input.isKeyPress("KeyF")) this.engine.createObject(Player, { position: this.engine.input.mousePosition });
    // if (this.engine.input.isKeyDown("KeyX")) this.engine.createObject(PlayerSword, { position: this.engine.input.mousePosition });
  };
}

class Barrel extends GameObject {
  sortLayer = -5;
  onStart = () => {
    this.addComponent(SpriteComponent).setProps({ sprite: GameEngine.loadImage("barrel.png") });
  };
}

const getSize = (pixelScale: number) => {
  const maxW = window.innerWidth / pixelScale;
  const maxH = window.innerHeight / pixelScale;
  const width = maxW - (maxW % pixelScale);
  const height = maxH - (maxH % pixelScale);

  return { width, height };
};

const init = () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
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
init();
