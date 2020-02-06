import { ITransform, Matrix2DTransform } from "./gameObject";
import * as _ from "lodash";

export type Vector = [number, number];

export const vectorToIndex = ([x, y]: Vector, width: number): number => {
  return y * width + x;
};

export const indexToVector = (index: number, width: number, height: number): Vector => {
  return [Math.floor(index % width), Math.floor(index / height)];
};

export const generateId = (minChar: number, maxChar: number, length: number): string => {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += String.fromCharCode(Math.floor(randomRange(minChar, maxChar)));
  }
  return code;
};

export const randomRange = (min: number, max: number): number => {
  return min + Math.random() * (max - min);
};

export const shuffle = <T = any>(iterable: Iterable<T>): T[] => {
  return Array.from(iterable).sort((a, b) => (Math.random() > 0.5 ? -1 : 1));
};

export const addVector = ([ax, ay]: Vector, [bx, by]: Vector): Vector => {
  return [ax + bx, ay + by];
};

export const subVector = ([ax, ay]: Vector, [bx, by]: Vector): Vector => {
  return [ax - bx, ay - by];
};

export const multVectorValues = (a: Vector, b: Vector): Vector => {
  if (a.length !== b.length) throw new Error("incorrect vector length");
  return a.map((v, i) => v * b[i]) as Vector;
};

export const multVector = ([ax, ay]: Vector, value: number): Vector => {
  return [ax * value, ay * value];
};

export const magnitudeVector = ([ax, ay]: Vector): number => {
  return Math.sqrt(ax * ax + ay * ay);
};

export const rotateVector = ([ax, ay]: Vector, degrees: number): Vector => {
  const length = magnitudeVector([ax, ay]);
  const rad = degToRad(degrees);
  return addVector([ax, ay], [Math.cos(rad) * length, Math.sin(rad) * length]);
};

export const normalizeVector = (vec: Vector): Vector => {
  const magn = magnitudeVector(vec);
  if (magn === 0) return [0, 0];
  return multVector(vec, 1 / magn);
};
export const lerpVector = (fromVec: Vector, toVec: Vector, t: number): Vector => {
  const [ax, ay] = fromVec;
  const [bx, by] = toVec;
  return [lerp(ax, bx, t), lerp(ay, by, t)];
};

export const radToDeg = (angle: number) => {
  return angle * (180 / Math.PI);
};

export const degToRad = (angle: number) => {
  return angle / (180 / Math.PI);
};

export const addMatrix = (ma: number[], mb: number[]) => {
  return ma.map((e, i) => e + mb[i]);
};

export const multMatrix = (a: number[], b: number[], size: number) => {
  if (a.length % size !== 0) throw new Error("invalid matrix size a");
  if (b.length % size !== 0) throw new Error("invalid matrix size b");

  const row = a.length / size,
    col = b.length / size;

  const result = new Array(row * col);

  for (let i = 0; i < result.length; i++) {
    let ci = 0;
    for (let j = 0; j < size; j++) {
      let ai = a[j + size * Math.floor(i / col)];
      let bi = b[j * col + (i % col)];
      ci += ai * bi;
    }
    result[i] = ci;
  }
  return result;
};

export const lerp = (from: number, to: number, t: number) => {
  return from + (to - from) * t;
};

export const createMatrix = (transformData: ITransform): Matrix2DTransform => {
  const { angle, position, scale } = transformData;
  const radAngle = degToRad(angle);
  const cosine = Math.cos(radAngle);
  const sine = Math.sin(radAngle);
  const [x, y] = position;
  const [sx, sy] = scale;

  const matrix = [cosine * sx, sine * sx, -sine * sy, cosine * sy, Math.floor(x), Math.floor(y)];

  return matrix as Matrix2DTransform;
};

// export class Singleton {
//   static initialized = false;
//   static init() {
//     if (this.initialized) return false;
//     this.initialized = true;

//     return true;
//   }
//   static requireInitialize<T extends Singleton>(object: T) {
//     if (!object.initialized) throw `${object.constructor.name} is not initialized`;
//   }
// }
