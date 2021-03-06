import { IGameEventLoop, GameEventType, GameEngine } from "../engine";
import { GameObject } from "../gameObject";

export interface IGameComponent<T> extends IGameEventLoop {
  props: T;
  engine: GameEngine;
}

export abstract class GameComponent<T = any> implements IGameComponent<T> {
  started: boolean = false;
  props: T = {} as T;
  constructor(public engine: GameEngine, public gameObject: GameObject) {}
  public setProps = (props: Partial<T>): this => {
    this.props = { ...this.props, ...props };
    return this;
  };
  public onEvent = (e: GameEventType, ...args: any[]) => {
    switch (e) {
      case "start":
        return this.onStart();
      case "update":
        return this.onUpdate(args[0]);
      case "physics_update":
        return this.onPhysicsUpdate(args[0]);
      case "draw":
        return this.onDraw(args[0]);
      case "dispose":
        return this.onDispose();
    }
  };
  protected onStart = () => {};
  protected onUpdate = (delta: number) => {};
  protected onPhysicsUpdate = (delta: number) => {};
  protected onDraw = (ctx: CanvasRenderingContext2D) => {};
  protected onDispose = () => {};
}

export { AnimatorComponent, IAnimatorProps } from "./animator";
export { RectShapeComponent as ShapeComponent, IRectShapeProps as IShapeProps } from "./shape";
export { SpriteComponent, ISpriteProps } from "./sprite";
