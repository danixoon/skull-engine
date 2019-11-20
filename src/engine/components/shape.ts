import { Vector } from "../helpers";
import { GameComponent } from "./index";

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
