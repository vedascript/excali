export type TContextConfig = {
  height: number;
  width: number;
};

export enum ShapesEnum {
  Rectangle = "rectanlge",
  Line = "line",
  Text = "text",
  Pen = "pen",
}

export type InitCoord = { x: number; y: number };

const defaultCoord: InitCoord = { x: 0, y: 0 };

export type DrawingConfig = {
  isDrawing: boolean;
  initCoord: InitCoord;
  toDraw: ShapesEnum | undefined;
};

export const initDrawingConfig: DrawingConfig = {
  isDrawing: false,
  initCoord: defaultCoord,
  toDraw: undefined,
};

export type CanvasConfig = {
  canvasWidth: number;
  canvasHeight: number;
  context: CanvasRenderingContext2D | null;
};

export type RectangleCoord = {
  x1: number;
  y1: number;
  width: number;
  height: number;
};
export type LineCoord = { x1: number; y1: number; x2: number; y2: number };

export type Rectangle = {
  coordinates: Array<RectangleCoord>;
};

export type Line = {
  coordinates: Array<LineCoord>;
};

export type Text = {
  coordinates: Array<{ x: number; y: number }>;
  text: string;
  width: number;
  height: number;
};

export type PenCoordinate = { x: number; y: number };

export type Pen = {
  coordinates: Array<PenCoordinate>;
};

export type Shape<T extends ShapesEnum> = {
  id: string;
  type: T;
} & (T extends ShapesEnum.Rectangle
  ? Rectangle
  : T extends ShapesEnum.Line
  ? Line
  : T extends ShapesEnum.Text
  ? Text
  : T extends ShapesEnum.Pen
  ? Pen
  : object);

export enum ActionEnum {
  Move = "move",
  Resize = "resize",
}

type SelectedRectangle = {
  activeEdge?: "left" | "right" | "top" | "bottom";
};

export type SelectedShape<T extends ShapesEnum> = {
  isActive: boolean;
} & Shape<T> &
  (T extends ShapesEnum.Rectangle ? SelectedRectangle : object);

export type ShapesMap = Map<string, Shape<ShapesEnum>>;

export type RedoShape = Omit<Shape<ShapesEnum>, "coordinates"> & {
  coordinate: RectangleCoord | LineCoord | PenCoordinate[];
};
