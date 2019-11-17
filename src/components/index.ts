import { IGameEventLoop, IDrawable } from "../engine.js";
import { GameObject } from "../gameObject.js";
import { Vector } from "../helpers.js";

export interface IGameComponent<T> extends IGameEventLoop, IDrawable {
  props: T;
}

export abstract class GameComponent<T = any> implements IGameComponent<T> {
  started: boolean = false;
  props: T = {} as T;
  constructor(public gameObject: GameObject) {}
  setProps = (props: Partial<T>) => {
    this.props = { ...this.props, ...props };
  };
  onStart = () => {};
  onUpdate = (delta: number) => {};
  onDraw = (ctx: CanvasRenderingContext2D) => {};
  onDispose = () => {};
}

export interface IShapeProps {
  color: string;
  size: Vector;
}
export class ShapeComponent extends GameComponent<IShapeProps> {
  props: IShapeProps = {
    color: "#000000",
    size: [100, 100]
  };
  onUpdate = () => {
    // console.log("shape component updated");
  };
  onDraw = (ctx: CanvasRenderingContext2D) => {
    const { gameObject } = this;
    const { size, color } = this.props;
    if (!gameObject) return;
    const [x, y] = gameObject.getPivotOffset(size);
    const [w, h] = size;

    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  };
}

export interface ISpriteProps {
  atlas: Vector | null;
  sprite: CanvasImageSource | null;

  animSpeed: number;
  loop: boolean;
  playing: boolean;
  spriteId: number;
}
export class SpriteComponent extends GameComponent<ISpriteProps> {
  props: ISpriteProps = {
    animSpeed: 0.3,
    loop: true,
    spriteId: 0,
    playing: true,
    atlas: null,
    sprite: null
  };
  get atlasLength() {
    const { sprite, atlas } = this.props;
    if (!sprite) return 0;
    if (!atlas) return 1;
    const [sw, sh] = atlas;
    return Math.floor(Number(sprite.width.valueOf()) / sw);
  }
  get isLastFrame() {
    return Math.floor(this.props.spriteId) === this.atlasLength - 1;
  }
  onUpdate = (delta: number) => {
    const { loop, playing, animSpeed } = this.props;
    if (playing) {
      if (this.props.spriteId >= this.atlasLength - 1 && !loop) return;
      this.props.spriteId += animSpeed;
    }
  };
  onDraw = (ctx: CanvasRenderingContext2D) => {
    const { sprite, atlas, spriteId } = this.props;
    if (!sprite) return;

    const [x, y] = atlas ? this.gameObject.getPivotOffset(atlas) : this.gameObject.getPivotOffset([sprite.width, sprite.height] as Vector);

    // ctx.globalCompositeOperation()

    if (atlas) {
      const [sw, sh] = atlas;
      const horCells = Math.floor(Number(sprite.width.valueOf()) / sw);

      // const vertCells = Math.floor(Number(sprite.height.valueOf()) / sh);
      const sx = sw * Math.floor(spriteId % horCells),
        sy = 0; //sh * Math.floor((spriteId / horCells) % vertCells);
      ctx.drawImage(sprite, sx, sy, sw, sh, Math.floor(x), Math.floor(y), sw, sh);
    } else ctx.drawImage(sprite, x, y);
  };
}

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
