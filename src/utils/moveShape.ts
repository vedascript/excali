import { MutableRefObject } from "react";

import { SelectedShape, Shape, ShapesEnum } from "../types";
import drawLine from "./drawLine";
import drawRectangle from "./drawRectangle";
import {
  isLineSelected,
  isRectangleSelected,
  isText,
  isTextSelected,
} from "./typeGuards";
import drawText from "./drawText";

let delta: number = 0;
let deltaX: number = 0;
let deltaY: number = 0;

function moveShape(
  shape: SelectedShape<ShapesEnum>,
  event: MouseEvent,
  context: CanvasRenderingContext2D,
  once: MutableRefObject<boolean>
) {
  if (!once.current) {
    calculateDelta(shape, event, once);
  }

  let shapeMoved: Shape<ShapesEnum> | undefined;

  if (isRectangleSelected(shape)) {
    shapeMoved = moveRectangle(shape, event, context);
  } else if (isLineSelected(shape)) {
    shapeMoved = moveLine(shape, event, context);
  } else if (isTextSelected(shape)) {
    shapeMoved = moveText(shape, event, context);
  }

  return shapeMoved;
}

function calculateDelta(
  shape: SelectedShape<ShapesEnum>,
  event: MouseEvent,
  once: MutableRefObject<boolean>
) {
  if (isRectangleSelected(shape)) {
    const { offsetX, offsetY } = event;
    const { activeEdge, coordinates } = shape;
    const { x1, y1 } = coordinates[coordinates.length - 1];

    if (activeEdge === "left" || activeEdge === "right") {
      delta = offsetY - y1;
    }

    if (activeEdge === "bottom" || activeEdge === "top") {
      delta = offsetX - x1;
    }
  } else if (shape.type === ShapesEnum.Line) {
    if (isLineSelected(shape)) {
      const { coordinates } = shape;
      const { offsetX, offsetY } = event;
      const { x1, y1 } = coordinates[coordinates.length - 1];

      deltaX = offsetX - x1;
      deltaY = offsetY - y1;
    }
  } else if (shape.type === ShapesEnum.Text) {
    if (isText(shape)) {
      const { coordinates } = shape;
      const { offsetX } = event;
      const { x } = coordinates[coordinates.length - 1];

      delta = offsetX - x;
    }
  }

  once.current = true;
}

function moveRectangle(
  shape: SelectedShape<ShapesEnum.Rectangle>,
  event: MouseEvent,
  context: CanvasRenderingContext2D
): Shape<ShapesEnum.Rectangle> {
  const { coordinates, activeEdge, type } = shape;
  const { width, height } = coordinates[coordinates.length - 1];

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
      break;
  }

  const rectangle: Shape<ShapesEnum.Rectangle> = {
    type,
    id: shape.id,
    coordinates: [
      ...shape.coordinates,
      { x1: newX1, y1: newY1, width, height },
    ],
  };

  drawRectangle(context, rectangle);
  return rectangle;
}

function moveLine(
  shape: SelectedShape<ShapesEnum.Line>,
  event: MouseEvent,
  context: CanvasRenderingContext2D
): Shape<ShapesEnum.Line> {
  const { coordinates, id, type } = shape;
  const { offsetX, offsetY } = event;
  const { x1, x2, y1, y2 } = coordinates[coordinates.length - 1];

  const newX1 = offsetX - deltaX;
  const newY1 = offsetY - deltaY;

  const newX2 = newX1 + (x2 - x1);
  const newY2 = newY1 + (y2 - y1);

  const line = {
    id,
    type,
    coordinates: [
      ...coordinates,
      { x1: newX1, x2: newX2, y1: newY1, y2: newY2 },
    ],
  };

  drawLine(context, line);
  return line;
}

function moveText(
  shape: SelectedShape<ShapesEnum.Text>,
  event: MouseEvent,
  context: CanvasRenderingContext2D
): Shape<ShapesEnum.Text> {
  const { text } = shape;
  const { offsetX, offsetY } = event;

  const newX = offsetX - delta;
  const newY = offsetY;

  const textShape = {
    ...shape,
    coordinates: [...shape.coordinates, { x: newX, y: newY }],
  };

  drawText(context, text, newX, newY);
  return textShape;
}

export default moveShape;
