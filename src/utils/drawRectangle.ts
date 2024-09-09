import { Shape, ShapesEnum } from "../types";

function drawRectangle(
  context: CanvasRenderingContext2D,
  rectangle: Shape<ShapesEnum.Rectangle>
) {
  const { coordinates } = rectangle;
  const { x1, y1, width, height } = coordinates[coordinates.length - 1];
  context.beginPath();
  context.roundRect(x1, y1, width, height, 4);
  context.stroke();
}

export default drawRectangle;
