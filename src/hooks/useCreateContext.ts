import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";

import {
  drawExistingShapes,
  drawShapes,
  isLine,
  isRectangle,
  moveShape,
} from "../utils";
import {
  CanvasConfig,
  DrawingConfig,
  SelectedShape,
  Shape,
  ShapesEnum,
  ShapesMap,
  initDrawingConfig,
} from "../types";

function useCreateContext(
  canvasRef: RefObject<HTMLCanvasElement>,
  drawingConfig: DrawingConfig,
  shapesMap: ShapesMap,
  setShapesMap: (map: ShapesMap) => void,
  setDrawingConfig: Dispatch<SetStateAction<DrawingConfig>>
) {
  const { toDraw, isDrawing, initCoord } = drawingConfig;
  const [canvasConfig, setCanvasConfig] = useState<CanvasConfig>({
    context: null,
    canvasHeight: 0,
    canvasWidth: 0,
  });

  const [selectedShapeConfig, setSelectedShapeConfig] =
    useState<SelectedShape<ShapesEnum>>();

  const shapeId = useRef<string>("");
  const once = useRef<boolean>(false);
  const activeShape = useRef<Shape<ShapesEnum>>();

  function handleMouseDown(event: MouseEvent) {
    if (toDraw) {
      setDrawingConfig((prev: DrawingConfig) => ({
        ...prev,
        isDrawing: true,
        initCoord: { x: event.offsetX, y: event.offsetY },
      }));

      shapeId.current = uuidv4();
    }

    if (selectedShapeConfig && canvasConfig.context) {
      setSelectedShapeConfig({ ...selectedShapeConfig, isActive: true });
    }
  }

  // draw

  function handleMouseMove(event: MouseEvent) {
    const { context, canvasHeight, canvasWidth } = canvasConfig;

    if (isDrawing && context && toDraw) {
      context.clearRect(0, 0, canvasWidth, canvasHeight);

      drawExistingShapes(shapesMap, context);

      drawShapes(
        context,
        toDraw,
        event,
        initCoord,
        shapeId.current,
        activeShape
      );
    }

    if (!isDrawing) {
      if (selectedShapeConfig?.isActive && context) {
        context.clearRect(0, 0, canvasWidth, canvasHeight);

        activeShape.current = moveShape(
          selectedShapeConfig,
          event,
          context,
          once
        );

        drawExistingShapes(shapesMap, context, selectedShapeConfig.id);
      } else {
        hoverOverShapes(shapesMap, event, setSelectedShapeConfig, context);
      }
    }
  }

  function handleMouseUp() {
    const { context } = canvasConfig;

    if (context && isDrawing) {
      setDrawingConfig(initDrawingConfig);
      context?.closePath();
      shapeId.current = "";

      activeShape.current &&
        setShapesMap(
          shapesMap.set(activeShape.current.id, activeShape.current)
        );

      activeShape.current = undefined;
    } else if (selectedShapeConfig?.isActive) {
      setSelectedShapeConfig(undefined);
      once.current = false;
      document.body.style.cursor = "default";

      activeShape.current &&
        setShapesMap(
          shapesMap.set(selectedShapeConfig.id, activeShape.current)
        );
      activeShape.current = undefined;
    }
  }
  console.log({ shapesMap });
  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef?.current;

    if (canvas) {
      const context = canvas.getContext("2d");
      canvas.width = document.body.clientWidth;
      canvas.height = document.body.clientHeight;

      setCanvasConfig({
        context,
        canvasHeight: canvas.height,
        canvasWidth: canvas.width,
      });
    }
  }, []);

  useEffect(() => {
    let canvas: HTMLCanvasElement;

    if (canvasRef.current) {
      canvas = canvasRef.current;

      canvas.addEventListener("mousedown", handleMouseDown);

      canvas.addEventListener("mousemove", handleMouseMove);

      canvas.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      canvas?.removeEventListener("mousedown", handleMouseDown);

      canvas?.removeEventListener("mousemove", handleMouseMove);

      canvas?.removeEventListener("mouseup", handleMouseUp);
    };
  }, [toDraw, isDrawing, selectedShapeConfig]);

  return canvasConfig;
}

export default useCreateContext;

function hoverOverShapes(
  shapesMap: Map<string, Shape<ShapesEnum>>,
  event: MouseEvent,
  selectShapeToMove: (shape: SelectedShape<ShapesEnum> | undefined) => void,
  context: CanvasRenderingContext2D | null
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [_, shape] of shapesMap) {
    switch (shape.type) {
      case ShapesEnum.Rectangle: {
        if (isRectangle(shape)) {
          const { offsetX: currentX, offsetY: currentY } = event;

          const { coordinates } = shape;
          const { height, width, x1, y1 } = coordinates[coordinates.length - 1];

          const selectedShape: SelectedShape<ShapesEnum.Rectangle> = {
            ...shape,
            isActive: false,
            activeEdge: undefined,
          };

          const x2 = x1 + width;
          const y2 = y1 + height;

          if (
            currentX === x1 ||
            (currentX >= x1 - 10 &&
              currentX <= x1 + 10 &&
              currentY > y1 &&
              currentY < y2)
          ) {
            document.body.style.cursor = "move";
            selectedShape.activeEdge = "left";
            selectShapeToMove(selectedShape);
            console.log("left edge");
            return;
          } else if (
            (currentX === x2 || (currentX >= x2 - 10 && currentX <= x2 + 10)) &&
            currentY > y1 &&
            currentY < y2
          ) {
            document.body.style.cursor = "move";
            selectedShape.activeEdge = "right";
            selectShapeToMove(selectedShape);
            return;
          } else if (
            (currentY === y1 || (currentY >= y1 - 10 && currentY <= y1 + 10)) &&
            currentX > x1 &&
            currentX < x2
          ) {
            document.body.style.cursor = "move";
            selectedShape.activeEdge = "top";
            selectShapeToMove(selectedShape);
            return;
          } else if (
            (currentY === y2 || (currentY >= y2 - 10 && currentY <= y2 + 10)) &&
            currentX > x1 &&
            currentX < x2
          ) {
            document.body.style.cursor = "move";
            selectedShape.activeEdge = "bottom";
            selectShapeToMove(selectedShape);
            return;
          } else {
            document.body.style.cursor = "default";
            selectShapeToMove(undefined);
          }
        }
        break;
      }

      case ShapesEnum.Line: {
        if (isLine(shape)) {
          const { offsetX: currentX, offsetY: currentY } = event;
          const { coordinates } = shape;
          const { x1, x2, y1, y2 } = coordinates[coordinates.length - 1];

          const selectedShape: SelectedShape<ShapesEnum.Line> = {
            ...shape,
            isActive: false,
          };

          if (context) {
            if (onLine(x1, y1, x2, y2, currentX, currentY)) {
              document.body.style.cursor = "move";
              selectShapeToMove(selectedShape);
              return;
            } else {
              document.body.style.cursor = "default";
              selectShapeToMove(undefined);
            }
          }
        }
        break;
      }

      default:
        break;
    }
  }
}

type PointType = { x: number; y: number };

const onLine = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x: number,
  y: number,
  maxDistance: number = 1
): string | null => {
  const a: PointType = { x: x1, y: y1 };
  const b: PointType = { x: x2, y: y2 };
  const c: PointType = { x, y };
  const offset = distance(a, b) - (distance(a, c) + distance(b, c));
  return Math.abs(offset) < maxDistance ? "inside" : null;
};

const distance = (a: PointType, b: PointType) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
