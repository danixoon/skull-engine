import { Vector, multVectorValues, multVector, degToRad, addMatrix } from "./helpers";
import { GameComponent } from "./components/index";
import { IGameEventLoop, GameEngine, GameEventType } from "./engine";

export type GameComponentConstructor<T extends GameComponent> = new <P>(gameEngine: GameEngine, gameObject: GameObject, props?: Partial<P>) => T;
export type Matrix2DTransform = [number, number, number, number, number, number];

export interface IGameObjectProps {
  transform: Transform;
  sortLayer: number;
}

export interface ITransform {
  position: Vector;
  localPosition: Vector;
  scale: Vector;
  pivot: Vector;
  angle: number;
}

export class Transform implements ITransform {
  position: Vector = [0, 0];
  localPosition: Vector = [0, 0];
  scale: Vector = [1, 1];
  pivot: Vector = [0.5, 0.5];
  angle: number = 0;

  constructor(transform?: Partial<ITransform>) {
    if (transform) Object.assign(this, transform);
  }

  // Возвращает отсутп на основе pivot
  getPivotOffset = (size: Vector): Vector => {
    return multVectorValues(this.pivot, multVector(size, -1));
  };

  pointToLocal = (point: Vector) => {};
  vectorToLocal = (vector: Vector) => {

  };
}

export interface IGameObject extends IGameObjectProps, IGameEventLoop {
  components: Set<GameComponent>;
  childrens: Set<GameObject>;
}

export type ComponentGetter = {
  <T extends GameComponent>(component: T): undefined | T;
};

export abstract class GameObject implements IGameObject {
  static getDefaultProps(): IGameObjectProps {
    return {
      transform: new Transform(),
      sortLayer: 0
    };
  }

  readonly name: string;

  // get transformMatrix(): Matrix2DTransform {
  //   let transform = this.localTransformMatrix;
  //   if (this.parent) {
  //     transform =  //addMatrix(transform, this.parent.transformMatrix) as Matrix2DTransform;
  //   }
  //   return transform;
  // }

  get localTransformMatrix(): Matrix2DTransform {
    const { angle, position, scale } = this.transform;
    const radAngle = degToRad(angle);
    const cosine = Math.cos(radAngle);
    const sine = Math.sin(radAngle);
    const [x, y] = position;
    const [sx, sy] = scale;

    return [cosine * sx, sine * sx, -sine * sy, cosine * sy, Math.floor(x), Math.floor(y)];
  }

  transform = new Transform();
  sortLayer = 0;

  readonly childrens = new Set<GameObject>();
  public parent: GameObject | null = null;

  readonly components = new Set<GameComponent>();

  readonly engine: GameEngine;

  active = true;
  started = false;

  constructor(engine: GameEngine, props: Partial<IGameObjectProps>, name: string) {
    // const properties = { ...props, ...GameObject.getDefaultProps() };
    // for (let p in properties) (this[p as keyof this] as any) = properties[p as keyof typeof properties];
    Object.assign(this, { ...GameObject.getDefaultProps(), ...props });
    this.engine = engine;
    this.name = name;
  }

  // setChild = (gameObject: GameObject | null) => {
  //   this.childrens.add(gameObject);
  // };

  // setParent = (gameObject: GameObject | null) => {
  //   if (!gameObject) {
  //     if (this.parent) {
  //       this.parent.childrens.
  //     }
  //     this.parent = null;
  //   } else {
  //     this.parent = gameObject;
  //   }
  // };

  addComponent = <T extends GameComponent>(componentType: GameComponentConstructor<T>) => {
    const prot = Object.getPrototypeOf(componentType);
    if (prot !== GameComponent) throw "component doesn't inherit base class GameComponent";
    const component = new componentType(this.engine, this);
    // Инициализируем компонент
    component.onEvent("init");
    this.components.add(component);

    return component;
  };
  removeComponent = <T extends GameComponent>(component: T) => {
    // Освобождаем компонент
    component.onEvent("dispose");
    this.components.delete(component);
  };
  getComponents = <T extends GameComponent>(componentType: GameComponentConstructor<T>): T[] => {
    const componentsArray = Array.from<GameComponent>(this.components.values());
    // Если мы передаём тип компонента
    return componentsArray.filter(c => c instanceof componentType) as T[];
  };
  getComponent = <T extends GameComponent>(component: T | GameComponentConstructor<T>) => {
    const componentsArray = Array.from<GameComponent>(this.components.values());
    const componentType = Object.getPrototypeOf(component);
    // Если мы передаём тип компонента
    if (componentType !== GameComponent) return componentsArray.find(c => c instanceof componentType);
    // Если же ссылку на него
    else return componentsArray.find(c => c === component);
  };

  setActive = (active = true) => {
    this.active = active;
    console.log(`game object <${this.name}> active state is [${active}]`);
  };

  update = (delta: number) => {
    this.onUpdate(delta);
  };

  public onEvent = (e: GameEventType, ...args: any[]) => {
    switch (e) {
      case "init":
        return this.onInit();
      case "start":
        return this.onStart();
      case "update":
        return this.onUpdate(args[0]);
      case "physics_update":
        return this.onPhysicsUpdate(args[0]);
      case "dispose":
        return this.onDispose();
    }
  };

  protected onInit = () => {};
  protected onStart = () => {};
  protected onUpdate = (delta: number) => {};
  protected onPhysicsUpdate = (delta: number) => {};
  protected onDispose = () => {};
}
