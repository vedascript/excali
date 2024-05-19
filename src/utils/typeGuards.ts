import { RedoShape, SelectedShape, Shape, ShapesEnum } from "../types";

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

export function isText(
  shape: Shape<ShapesEnum>
): shape is Shape<ShapesEnum.Text> {
  return shape.type === ShapesEnum.Text;
}

export function isPen(
  shape: Shape<ShapesEnum>
): shape is Shape<ShapesEnum.Pen> {
  return shape.type === ShapesEnum.Pen;
}

export function isNotPen(
  shape: Shape<ShapesEnum>
): shape is Shape<ShapesEnum.Rectangle | ShapesEnum.Line> {
  return shape.type !== ShapesEnum.Pen;
}

export function isRedoShapePen(
  shape: RedoShape
): shape is RedoShape & { type: ShapesEnum.Pen } {
  return shape.type === ShapesEnum.Pen;
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

export function isTextSelected(
  shape: SelectedShape<ShapesEnum>
): shape is SelectedShape<ShapesEnum.Text> {
  return shape.type === ShapesEnum.Text;
}
