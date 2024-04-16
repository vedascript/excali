export type TContextConfig = {
  height: number;
  width: number;
};

export enum ShapesEnum {
  Rectangle = "rectanlge",
  Line = "line",
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

export type Rectangle = {
  type: ShapesEnum.Rectangle;
  width: number;
  height: number;
};

export type Line = {
  type: ShapesEnum.Line;
  x2: number;
  y2: number;
};

export type Shape<T extends ShapesEnum> = {
  id: string;
  x1: number;
  y1: number;
} & (T extends ShapesEnum.Rectangle
  ? Rectangle
  : T extends ShapesEnum.Line
  ? Line
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
