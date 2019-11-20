import { generateId, shuffle, Vector, addVector, subVector, multVector, multVectorValues } from "./helpers";
import { GameObject, IGameObjectProps } from "./gameObject";
import { GameInput } from "./input";

export const RESOURCE_PATH = "resources/";
export const generateName = () => {
  // Можно юзать и без shuffla для большего шанса исключения повторяющегося значения, но с shuffle значение имеет
  // более приятный хаотический вид
  return shuffle(Date.now() + generateId(97, 122, 5)).join("");
};

export type GameEventType = "draw" | "update" | "physics_update" | "start" | "init" | "dispose";
export interface IGameEventLoop {
  onEvent(event: GameEventType, ...args: any[]): void;

  // onStart(): void;
  // onUpdate(delta: number): void;
  // onPhisycsUpdate(delta: number): void;
  // onDispose(): void;
}

export class GameEngine {
  private disposedObjects: GameObject[] = [];
  private createdObjects: GameObject[] = [];

  gameObjects = new Map<string, GameObject>();
  input = new GameInput();
  ctx: CanvasRenderingContext2D;
  colliderMap: Vector[] = [];

  camera: {
    position: Vector;
    pivot: Vector;
    angle: number;
  } = {
    position: [0, 0],
    angle: 0,
    pivot: [0.5, 0.5]
  };

  static loadImage(src: string) {
    const img = new Image();
    img.src = RESOURCE_PATH + src;
    return img;
  }

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.ctx = ctx;
  }

  private startRender = () => {
    const tick = performance.now();
    window.requestAnimationFrame(() => this.render(tick, tick));
  };
  private render = (rTick: number, lastTick: number) => {
    const tick = performance.now();

    this.proceedLoop(lastTick / tick);
    window.requestAnimationFrame(rTick => this.render(rTick, tick));
  };

  private proceedLoop = (delta: number) => {
    const { ctx, camera } = this;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    Array.from(this.gameObjects.values())
      .sort((a, b) => (a.sortLayer > b.sortLayer ? 1 : -1))
      .forEach(o => {
        // Если о старте не сообщили - стартуем
        if (!o.started) (o.started = true) && o.onEvent("start");
        // В ином случае посылаем onUpdate
        else {
          o.components.forEach(c => {
            if (!c.started) (c.started = true) && c.onEvent("start");
            else {
              c.onEvent("update", delta);
              c.onEvent("physics_update", delta);
              ctx.save();

              ctx.translate(Math.floor(ctx.canvas.width * this.camera.pivot[0]), Math.floor(ctx.canvas.height * this.camera.pivot[1]));
              ctx.translate(...(camera.position.map(v => -Math.floor(v)) as Vector));
              // Если есть родитель устанавливаем его матрицу для нашего объекта
              if (o.parent) ctx.transform(...o.parent.localTransformMatrix);
              // А потом двигаем и нас
              ctx.transform(...o.localTransformMatrix);

              ctx.rotate(camera.angle);
              // И рисуем
              c.onEvent("draw", ctx);

              ctx.restore();
            }
          });
          o.onEvent("update", delta);
          this.input.flushAfterUpdate();
        }
      });

    for (let o of this.createdObjects) {
      o.onEvent("init");
      this.gameObjects.set(o.name, o);
      // console.log("created.. but objects: ", this.createdObjects);
    }

    // Уничтожаем все объекты в очереди
    for (let o of this.disposedObjects) {
      o.onEvent("dispose");
      this.gameObjects.delete(o.name);
    }

    // this.createdObjects.forEach(o => {
    //   o.onEvent("init");
    //   this.gameObjects.set(o.name, o);
    //   console.log("created.. but objects: ", this.createdObjects);
    // });

    // this.disposedObjects.forEach(o => {});
    this.createdObjects = [];
    this.disposedObjects = [];
  };

  init({ width, height, smoothImage, scale }: { width?: number; height?: number; smoothImage?: boolean; scale: number }) {
    width && (this.ctx.canvas.width = width);
    height && (this.ctx.canvas.height = height);
    if (smoothImage !== undefined) this.ctx.imageSmoothingEnabled = smoothImage;

    this.input.scale = scale;

    this.startRender();
  }

  getObject = <T extends GameObject>(name: string) => {
    return this.gameObjects.get(name) as T;
  };

  setParent = (targetObject: GameObject, parentObject: GameObject) => {
    if (targetObject.parent) {
      targetObject.parent.childrens.delete(targetObject);
    }
    // targetObject.transformMatrix = parentObject.transformMatrix;
    targetObject.parent = parentObject;
    parentObject.childrens.add(targetObject);
  };

  setChild = (targetObject: GameObject, childrenObjects: GameObject[] | GameObject) => {
    // Превращаем аргумент в массив, если он им не является
    const childrens: GameObject[] = Array.isArray(childrenObjects) ? childrenObjects : [childrenObjects];
    childrens.forEach(c => {
      this.setParent(c, targetObject);
      // Строчка не обязательна, т.к. setParent также устанавливает у детей объект потомка
      // targetObject.childrens.add(c);
    });
  };

  createObject = <T extends GameObject>(
    GameObjectType: new (engine: GameEngine, props: Partial<IGameObjectProps>, name: string) => T,
    props?: Partial<IGameObjectProps>,
    name: string = generateName()
  ) => {
    if (this.gameObjects.has(name)) throw new Error(`game object with name <${name}> already exists`);
    if (Object.getPrototypeOf(GameObjectType) !== GameObject) throw new Error(`game object doesn't inherit GameObject class`);

    // console.log(`creating game object with name <${name}>`);

    const gameObject = new GameObjectType(this, props || {}, name);
    // this.gameObjects.set(name, gameObject);

    this.createdObjects.push(gameObject);
    return gameObject;
  };

  // addObject = <T extends GameObject>(): GameObject => {

  // };

  removeObject = (name: string) => {
    const gameObject = this.gameObjects.get(name);
    if (!gameObject) throw new Error(`game object with name <${name}> doesn't exists`);

    // Добавляем объект в очередь удаления
    this.disposedObjects.push(gameObject);
  };
}
