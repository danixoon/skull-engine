import { Vector } from "./helpers";

export class GameInput {
  private keypress = new Set();
  private keydown = new Set();
  private keyup = new Set();

  public scale: number = 1;

  private onKeyDown = (key: KeyboardEvent) => {
    if (this.keypress.has(key.code)) return;
    console.log("keydown: ", key.code);
    this.keypress.add(key.code);
    this.keydown.add(key.code);
  };
  private onKeyUp = (key: KeyboardEvent) => {
    this.keypress.delete(key.code);
    this.keyup.add(key.code);
  };
  private onMouseMove = (ev: MouseEvent) => {
    const s = this.scale;
    this._mousePosition = [Math.floor(ev.x / s), Math.floor(ev.y / s)];
  };

  flushAfterUpdate = () => {
    this.keydown.clear();
    this.keyup.clear();
  };

  isKeyPress = (keycode: string) => this.keypress.has(keycode);
  isKeyUp = (keycode: string) => this.keyup.has(keycode);
  isKeyDown = (keycode: string) => this.keydown.has(keycode);

  private _mousePosition: Vector = [0, 0];
  get mousePosition(): Vector {
    return this._mousePosition;
  }

  constructor() {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("mousemove", this.onMouseMove);
  }
}
