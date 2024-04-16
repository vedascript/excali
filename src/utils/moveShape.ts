import { MutableRefObject } from "react";

import { SelectedShape, Shape, ShapesEnum } from "../types";
import drawLine from "./drawLine";
import drawRectangle from "./drawRectangle";

let delta: number = 0;
let deltaX: number = 0;
let deltaY: number = 0;

function moveShape(
  shape: SelectedShape<ShapesEnum>,
  event: MouseEvent,
  context: CanvasRenderingContext2D,
  once: MutableRefObject<boolean>,
  setShapes: (shapeId: string, shape: Shape<ShapesEnum>) => void
) {
  if (!once.current) {
    calculateDelta(shape, event, once);
  }

  if (shape.type === ShapesEnum.Rectangle) {
    moveRectangle(shape, event, context, setShapes);
  } else if (shape.type === ShapesEnum.Line) {
    moveLine(shape, event, context, setShapes);
  }
}

function calculateDelta(
  shape: SelectedShape<ShapesEnum>,
  event: MouseEvent,
  once: MutableRefObject<boolean>
) {
  if (shape.type === ShapesEnum.Rectangle) {
    const { offsetX, offsetY } = event;
    const { x1, y1, activeEdge } = shape as SelectedShape<ShapesEnum.Rectangle>;

    if (activeEdge === "left" || activeEdge === "right") {
      delta = offsetY - y1;
    }

    if (activeEdge === "bottom" || activeEdge === "top") {
      delta = offsetX - x1;
    }
  } else if (shape.type === ShapesEnum.Line) {
    const { x1, y1 } = shape;
    const { offsetX, offsetY } = event;

    deltaX = offsetX - x1;
    deltaY = offsetY - y1;
  }

  once.current = true;
}

function moveRectangle(
  shape: SelectedShape<ShapesEnum>,
  event: MouseEvent,
  context: CanvasRenderingContext2D,
  setShapes: (shapeId: string, shape: Shape<ShapesEnum>) => void
) {
  const { width, height, activeEdge, type } =
    shape as SelectedShape<ShapesEnum.Rectangle>;

  const { offsetX, offsetY } = event;

  let newX1: number = 0;
  let newY1: number = 0;

  switch (activeEdge) {
    case "left": {
      newX1 = offsetX;
      newY1 = offsetY - delta;
      break;
    }
    case "right": {
      newX1 = offsetX - width;
      newY1 = offsetY - delta;
      break;
    }
    case "top": {
      newX1 = offsetX - delta;
      newY1 = offsetY;
      break;
    }

    case "bottom": {
      newX1 = offsetX - delta;
      newY1 = offsetY - height;
      break;
    }
    default:
      return;
  }

  const rectangle = {
    x1: newX1,
    y1: newY1,
    width,
    height,
    type,
    id: shape.id,
  };

  drawRectangle(context, rectangle);
  setShapes(shape.id, rectangle);
}

function moveLine(
  shape: SelectedShape<ShapesEnum>,
  event: MouseEvent,
  context: CanvasRenderingContext2D,
  setShapes: (shapeId: string, shape: Shape<ShapesEnum>) => void
) {
  const { x1, y1, x2, y2, id, type } = shape as Shape<ShapesEnum.Line>;
  const { offsetX, offsetY } = event;

  const newX1 = offsetX - deltaX;
  const newY1 = offsetY - deltaY;

  const newX2 = newX1 + (x2 - x1);
  const newY2 = newY1 + (y2 - y1);

  const line = { id, x1: newX1, x2: newX2, y1: newY1, y2: newY2, type };

  drawLine(context, line);
  setShapes(id, line);
}

export default moveShape;
