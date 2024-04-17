import { Shape, ShapesEnum } from "../types";

function drawLine(
  context: CanvasRenderingContext2D,
  line: Shape<ShapesEnum.Line>
) {
  const { coordinates } = line;
  const { x1, x2, y1, y2 } = coordinates[coordinates.length - 1];

  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
}

export default drawLine;
