import { addVector, Vector, multVector, normalizeVector, lerpVector, subVector, magnitudeVector } from "./engine/helpers";
import { GameObject } from "./engine/gameObject";
import { AnimatorComponent, SpriteComponent } from "./engine/components";
import { GameEngine } from "./engine/engine";
import { PhysicsComponent } from "./engine/components/physics";

export class Player extends GameObject {
  //@ts-ignore
  sprite: SpriteComponent;
  //@ts-ignore
  anim: AnimatorComponent;
  //@ts-ignore
  physics: PhysicsComponent;
  
  speed = 1.5;

  onInit = () => {
    this.sprite = this.addComponent(SpriteComponent);
    this.anim = this.addComponent(AnimatorComponent);
    this.physics = this.addComponent(PhysicsComponent);
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
    const { engine, transform } = this;
    const { camera, input } = engine;

    const horAxis = input.isKeyPress("KeyD") ? 1 : input.isKeyPress("KeyA") ? -1 : 0;
    const verAxis = input.isKeyPress("KeyS") ? 1 : input.isKeyPress("KeyW") ? -1 : 0;

    const normAxis = normalizeVector([horAxis, verAxis]);
    transform.position = addVector(transform.position, multVector(normAxis, this.speed));
    if (horAxis !== 0 || verAxis !== 0) {
      this.anim.setAnimation("run");
    } else {
      this.anim.setAnimation("idle");
    }
    if (horAxis !== 0) {
      transform.scale = [Math.abs(transform.scale[0]) * horAxis, 1];
    }

    const offset = 32;
    const [x, y] = transform.position;
    const [cx, cy] = camera.position;
    const dx = x - cx,
      dy = y - cy;

    let camPos: Vector = [cx, cy];
    const distance = 32;

    const dir = subVector(camPos, transform.position);
    const vec = addVector(transform.position, multVector(normalizeVector(dir), distance) as Vector);

    camPos = magnitudeVector(dir) > distance ? vec : camPos;

    // if (Math.abs(dx) > offset) camPos = [x - Math.sign(dx) * offset, camPos[1]];
    // if (Math.abs(dy) > offset) camPos = [camPos[0], y - Math.sign(dy) * offset];

    // camera.position = lerpVector(camera.position, camPos, 0.05);
    camera.position = camPos;
  };
}

export class PlayerSword extends GameObject {
  sortLayer = -1;
  onInit = () => {
    this.addComponent(SpriteComponent).setProps({ sprite: GameEngine.loadImage("weapon_sword_1.png") });
  };
}

export class GameController extends GameObject {
  onInit = () => {
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
