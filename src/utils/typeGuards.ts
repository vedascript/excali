import { SelectedShape, Shape, ShapesEnum } from "../types";

export function isRectangle(
  shape: Shape<ShapesEnum>
): shape is Shape<ShapesEnum.Rectangle> {
  return shape.type === ShapesEnum.Rectangle;
}

export function isLine(
  shape: Shape<ShapesEnum>
): shape is Shape<ShapesEnum.Line> {
  return shape.type === ShapesEnum.Line;
}

export function isRectangleSelected(
  shape: SelectedShape<ShapesEnum>
): shape is SelectedShape<ShapesEnum.Rectangle> {
  return shape.type === ShapesEnum.Rectangle;
}

export function isLineSelected(
  shape: SelectedShape<ShapesEnum>
): shape is SelectedShape<ShapesEnum.Line> {
  return shape.type === ShapesEnum.Line;
}
