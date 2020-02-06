import { Vector } from "../helpers";
import { GameComponent } from "./index";

export interface IRectShapeProps {
  color: string;
  size: Vector;
}
export class RectShapeComponent extends GameComponent<IRectShapeProps> {
  props: IRectShapeProps = {
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
    const [x, y] = gameObject.transform.getPivotOffset(size);
    const [w, h] = size;

    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  };
}
