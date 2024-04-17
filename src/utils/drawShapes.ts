import drawLine from "./drawLine";
import drawRectangle from "./drawRectangle";
import {
  InitCoord,
  LineCoord,
  RectangleCoord,
  Shape,
  ShapesEnum,
} from "../types";
import { MutableRefObject } from "react";

function drawShapes(
  context: CanvasRenderingContext2D,
  toDraw: ShapesEnum,
  event: MouseEvent,
  initCoord: InitCoord,
  shapeId: string,
  movedShape: MutableRefObject<Shape<ShapesEnum>> | MutableRefObject<undefined>
) {
  const { x: x1, y: y1 } = initCoord;
  const { offsetX: x2, offsetY: y2 } = event;

  switch (toDraw) {
    case ShapesEnum.Rectangle: {
      const coordinates: Array<RectangleCoord> = [
        {
          x1,
          y1,
          width: x2 - x1,
          height: y2 - y1,
        },
      ];

      const rectangle: Shape<ShapesEnum.Rectangle> = {
        id: shapeId,
        type: ShapesEnum.Rectangle,
        coordinates,
      };

      drawRectangle(context, rectangle);

      if (movedShape) movedShape.current = rectangle;

      break;
    }

    case ShapesEnum.Line: {
      const coordinates: Array<LineCoord> = [{ x1, x2, y1, y2 }];

      const line: Shape<ShapesEnum.Line> = {
        id: shapeId,
        type: ShapesEnum.Line,
        coordinates,
      };

      drawLine(context, line);

      if (movedShape) movedShape.current = line;

      break;
    }

    default:
      break;
  }
}

export default drawShapes;
