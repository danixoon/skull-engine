import { SpriteComponent } from "./sprite";
import { GameComponent } from "./index";

export interface IPhysicsProps {}
export class PhysicsComponent extends GameComponent<IPhysicsProps> {
  onStart = () => {};
  onUpdate = () => {};
  onPhysicsUpdate = () => {
    console.log("phys update!");
  };
}
