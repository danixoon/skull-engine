import { addVector, Vector, multVector, normalizeVector, lerpVector, subVector, magnitudeVector, multMatrix } from "../../engine/helpers";
import { GameObject } from "../../engine/gameObject";
import { AnimatorComponent, SpriteComponent, ShapeComponent } from "../../engine/components";
import { GameEngine } from "../../engine/engine";
import { PhysicsComponent } from "../../engine/components/physics";

export class Ball extends GameObject {
  //@ts-ignore
  shape: ShapeComponent;
  //@ts-ignore
  anim: AnimatorComponent;
  // @ts-ignore
  physics: PhysicsComponent;

  onInit = () => {
    this.shape = this.addComponent(ShapeComponent).setProps({ color: "#ff0000", size: [30, 30] });
    // this.physics = this.addComponent(PhysicsComponent).setProps({ gravity: [0, 1] });
  };

  onUpdate = () => {
    // console.log(this.transform.position[0]);
  };
}

export class GameController extends GameObject {
  //@ts-ignore
  ball1: GameObject;
  onInit = () => {
    const { engine } = this;
    const [x, y] = [0, 0]; //[engine.ctx.canvas.width / 2, engine.ctx.canvas.height / 2];
    this.ball1 = engine.createObject(Ball, { position: [x, y] as Vector });
    const ball2 = engine.createObject(Ball, { position: [x + 200, y] as Vector });
    const ball3 = engine.createObject(Ball, { position: [x + 400, y] as Vector });

    engine.setChild(this.ball1, ball2);
    engine.setChild(ball2, ball3);
    // const player = engine.createObject(Player, { position: [x, y] as Vector });
    // const sword = engine.createObject(PlayerSword, { position: [8, 0] as Vector });
    // const barrel = engine.createObject(Barrel, { position: [x + 32, y - 32] as Vector });

    // engine.setParent(sword, player);
  };
  onUpdate = () => {
    if (this.engine.input.isKeyPress("KeyR")) {
      this.ball1.transform.angle += 20;
    }
    if (this.engine.input.isKeyPress("ArrowLeft")) {
      this.ball1.transform.position[0] += 20;
    }
  };
}
