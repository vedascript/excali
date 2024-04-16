import drawLine from "./drawLine";
import drawRectangle from "./drawRectangle";
import { InitCoord, Shape, ShapesEnum } from "../types";

function drawShapes(
  context: CanvasRenderingContext2D,
  toDraw: ShapesEnum,
  event: MouseEvent,
  initCoord: InitCoord,
  shapeId: string,
  updateShapesMap: (id: string, shape: Shape<ShapesEnum>) => void
) {
  const { x: x1, y: y1 } = initCoord;
  const { offsetX: x2, offsetY: y2 } = event;

  switch (toDraw) {
    case ShapesEnum.Rectangle: {
      const rectangle: Shape<ShapesEnum.Rectangle> = {
        height: y2 - y1,
        width: x2 - x1,
        type: ShapesEnum.Rectangle,
        x1,
        y1,
        id: shapeId,
      };

      drawRectangle(context, rectangle);
      updateShapesMap(shapeId, rectangle);
      break;
    }

    case ShapesEnum.Line: {
      const line: Shape<ShapesEnum.Line> = {
        id: shapeId,
        type: ShapesEnum.Line,
        x1,
        x2,
        y1,
        y2,
      };

      drawLine(context, line);
      updateShapesMap(shapeId, line);
      break;
    }

    default:
      break;
  }
}

export default drawShapes;
