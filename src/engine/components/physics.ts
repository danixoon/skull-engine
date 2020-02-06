import { SpriteComponent } from "./sprite";
import { GameComponent } from "./index";
import { Vector, addVector } from "../helpers";

export interface IPhysicsProps {
  mass: number;
  gravity: Vector;
  velocity: Vector;
}
export class PhysicsComponent extends GameComponent<IPhysicsProps> {
  props: IPhysicsProps = {
    mass: 1,
    gravity: [0, 0],
    velocity: [0, 0]
  };
  onStart = () => {};
  onUpdate = () => {};
  onPhysicsUpdate = () => {
    const { gameObject, props, engine } = this;
    const { transform } = gameObject;

    let velocity = addVector(props.velocity, props.gravity);
    let position = addVector(transform.position, velocity);

    

    // if(position[0] - velocity[0] < )

    props.velocity = velocity;
    transform.position = position;
  };
}
