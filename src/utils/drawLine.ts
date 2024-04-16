import { Shape, ShapesEnum } from "../types";

function drawLine(
  context: CanvasRenderingContext2D,
  line: Shape<ShapesEnum.Line>
) {
  const { x1, y1, x2, y2 } = line;

  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
}

export default drawLine;
