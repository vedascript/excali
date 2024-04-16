import { Shape, ShapesEnum } from "../types";

function drawRectangle(
  context: CanvasRenderingContext2D,
  rectangle: Shape<ShapesEnum.Rectangle>
) {
  const { x1, y1, width, height } = rectangle;
  context.beginPath();
  context.rect(x1, y1, width, height);
  context.stroke();
}

export default drawRectangle;
