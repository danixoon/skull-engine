import { SpriteComponent } from "./sprite";
import { GameComponent } from "./index";

export interface IAnimatorProps {
  sprite: SpriteComponent;
  animations: Map<string, CanvasImageSource>;
}
export class AnimatorComponent extends GameComponent<IAnimatorProps> {
  private animQueue: string[] = [];
  private currentAnim: string = "";

  onStart = () => {
    this.setAnimation(this.props.animations.keys().next().value);
  };

  setAnimation = (name: string, once: boolean = false) => {
    const { sprite, animations } = this.props;
    const anim = animations.get(name);
    if (!anim) throw new Error(`animation with name <${name}> doesn't exists`);

    if (once) this.animQueue.push(this.currentAnim);

    this.currentAnim = name;
    sprite.setProps({ sprite: anim });
  };
  onUpdate = () => {
    const { sprite, animations } = this.props;
    // Если последний фрейм анимации и в очереди есть анимации
    if (this.animQueue.length !== 0 && sprite.isLastFrame) {
      const anim = this.animQueue.pop() as string;
      this.setAnimation(anim);
    }
  };
}
