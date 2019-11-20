import { Vector } from "../helpers";

import { GameComponent } from "./index";

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
