import drawLine from "./drawLine";
import drawRectangle from "./drawRectangle";
import {
  InitCoord,
  LineCoord,
  PenCoordinate,
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
  movedShape: MutableRefObject<Shape<ShapesEnum>> | MutableRefObject<undefined>,
  penCoordinates: PenCoordinate[]
) {
  const { x: x1, y: y1 } = initCoord;
  const { offsetX: x2, offsetY: y2 } = event;
  console.log({ penCoordniates: penCoordinates });

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

    // case ShapesEnum.Pen: {
    //   context.beginPath();
    //   context.moveTo(x1, y1);
    //   context.lineTo(x2, y2);
    //   context.stroke();

    //   penCoordinates.push({ x: x2, y: y2 });

    //   const pen: Shape<ShapesEnum.Pen> = {
    //     id: shapeId,
    //     type: ShapesEnum.Pen,
    //     coordinates: [...penCoordinates],
    //   };

    //   if (movedShape) {
    //     movedShape.current = pen;
    //   }

    //   break;
    // }

    default:
      break;
  }
}

export default drawShapes;
