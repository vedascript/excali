import {
  Dispatch,
  MutableRefObject,
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
  getTypingArea,
  isLine,
  isRectangle,
  isText,
  moveShape,
} from "../utils";
import {
  CanvasConfig,
  DrawingConfig,
  PenCoordinate,
  SelectedShape,
  Shape,
  ShapesEnum,
  ShapesMap,
  initDrawingConfig,
} from "../types";
import drawText from "../utils/drawText";

function useCreateContext(
  canvasRef: RefObject<HTMLCanvasElement>,
  drawingConfig: DrawingConfig,
  shapesMap: ShapesMap,
  activeShapeIds: MutableRefObject<string[]>,
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
  const penCoordinates = useRef<Array<PenCoordinate>>([]);

  function handleMouseDown(event: MouseEvent) {
    if (toDraw) {
      setDrawingConfig((prev: DrawingConfig) => ({
        ...prev,
        isDrawing: true,
        initCoord: { x: event.offsetX, y: event.offsetY },
      }));

      shapeId.current = uuidv4();

      if (toDraw === ShapesEnum.Text) {
        handleDrawText(event, shapeId.current);
      } else if (toDraw === ShapesEnum.Pen && canvasConfig.context) {
        penCoordinates.current = [{ x: event.offsetX, y: event.offsetY }];
      }
    }

    if (selectedShapeConfig && canvasConfig.context) {
      setSelectedShapeConfig({ ...selectedShapeConfig, isActive: true });
    }
  }

  function handleMouseMove(event: MouseEvent) {
    const { context, canvasHeight, canvasWidth } = canvasConfig;

    if (isDrawing && context && toDraw) {
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      drawExistingShapes(shapesMap, context);

      if (toDraw === ShapesEnum.Pen) {
        penCoordinates.current.push({ x: event.offsetX, y: event.offsetY });
        context.beginPath();
        context.moveTo(
          penCoordinates.current[0].x,
          penCoordinates.current[0].y
        );
        penCoordinates.current.forEach((point) => {
          context.lineTo(point.x, point.y);
          context.stroke();
        });
        const pen: Shape<ShapesEnum.Pen> = {
          id: shapeId.current,
          coordinates: penCoordinates.current,
          type: ShapesEnum.Pen,
        };
        activeShape.current = pen;
      } else {
        drawShapes(
          context,
          toDraw,
          event,
          initCoord,
          shapeId.current,
          activeShape
        );
      }
    }

    if (!isDrawing && !toDraw) {
      if (selectedShapeConfig?.isActive && context) {
        context.clearRect(0, 0, canvasWidth, canvasHeight);

        activeShape.current = moveShape(
          selectedShapeConfig,
          event,
          context,
          once
        );

        drawExistingShapes(shapesMap, context, selectedShapeConfig.id);
      } else if (shapesMap.size) {
        hoverOverShapes(shapesMap, event, setSelectedShapeConfig, context);
      }
    }
  }

  function handleMouseUp() {
    const { context } = canvasConfig;

    if (context && isDrawing && activeShape.current) {
      setDrawingConfig(initDrawingConfig);
      context.closePath();
      shapeId.current = "";

      setShapesMap(shapesMap.set(activeShape.current.id, activeShape.current));

      activeShapeIds.current.push(activeShape.current.id);
      activeShape.current = undefined;

      penCoordinates.current = [];
    } else if (selectedShapeConfig?.isActive && activeShape.current) {
      setSelectedShapeConfig(undefined);
      once.current = false;
      document.body.style.cursor = "default";

      activeShape.current &&
        setShapesMap(
          shapesMap.set(selectedShapeConfig.id, activeShape.current)
        );

      activeShapeIds.current.push(activeShape.current.id);
      activeShape.current = undefined;
    }
  }

  function handleDrawText(event: MouseEvent, shapeId: string) {
    const { typingArea, x1, y1 } = getTypingArea(event);

    typingArea.addEventListener("blur", () => {
      if (!canvasConfig.context) return;

      drawText(canvasConfig.context, typingArea.innerText, x1, y1);

      setShapesMap(
        shapesMap.set(shapeId, {
          id: shapeId,
          type: ShapesEnum.Text,
          coordinates: [{ x: x1, y: y1 }],
          text: typingArea.innerText,
          width: typingArea.clientWidth,
          height: typingArea.clientHeight,
        })
      );

      typingArea.remove();
      activeShapeIds.current.push(shapeId);
    });

    setDrawingConfig(initDrawingConfig);
  }

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
  }, [toDraw, isDrawing, selectedShapeConfig, shapesMap.size]);

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

      case ShapesEnum.Text: {
        if (isText(shape)) {
          const { offsetX, offsetY } = event;
          const { coordinates } = shape;
          const { x, y } = coordinates[coordinates.length - 1];

          if (
            offsetX >= x &&
            offsetX <= x + shape.width &&
            offsetY >= y - 16 &&
            offsetY <= y - 16 + shape.height
          ) {
            document.body.style.cursor = "move";
            selectShapeToMove({ ...shape, isActive: false });
            return;
          } else {
            document.body.style.cursor = "default";
            selectShapeToMove(undefined);
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
