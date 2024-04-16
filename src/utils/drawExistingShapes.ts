import drawLine from "./drawLine";
import drawRectangle from "./drawRectangle";
import { Shape, ShapesEnum } from "../types";

function drawExistingShapes(
  shapesMap: Map<string, Shape<ShapesEnum>>,
  context: CanvasRenderingContext2D,
  ignoreShapeId?: string
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [_, shape] of shapesMap) {
    if (shape.id === ignoreShapeId) {
      // ignore re-drawing the moving shape.
      continue;
    }

    switch (shape.type) {
      case ShapesEnum.Rectangle: {
        drawRectangle(context, shape);
        break;
      }

      case ShapesEnum.Line: {
        drawLine(context, shape);
        break;
      }

      default:
        break;
    }
  }
}

export default drawExistingShapes;
