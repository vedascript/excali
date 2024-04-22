import drawLine from "./drawLine";
import drawRectangle from "./drawRectangle";
import { Shape, ShapesEnum } from "../types";
import { isLine, isRectangle, isText } from "./typeGuards";
import drawText from "./drawText";

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
        if (isRectangle(shape)) {
          drawRectangle(context, shape);
        }
        break;
      }

      case ShapesEnum.Line: {
        if (isLine(shape)) {
          drawLine(context, shape);
        }
        break;
      }

      case ShapesEnum.Text: {
        if (isText(shape)) {
          const { x, y } = shape.coordinates[shape.coordinates.length - 1];
          drawText(context, shape.text, x, y);
        }

        break;
      }

      default:
        break;
    }
  }
}

export default drawExistingShapes;
