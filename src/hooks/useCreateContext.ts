import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";

import { drawExistingShapes, drawShapes, moveShape } from "../utils";
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

  function updateShapesMap(id: string, shape: Shape<ShapesEnum>) {
    setShapesMap(shapesMap.set(id, shape));
  }

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
        updateShapesMap
      );
    }

    if (!isDrawing) {
      if (selectedShapeConfig?.isActive && context) {
        context.clearRect(0, 0, canvasWidth, canvasHeight);

        moveShape(selectedShapeConfig, event, context, once, updateShapesMap);
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
    } else if (selectedShapeConfig?.isActive) {
      setSelectedShapeConfig(undefined);
      once.current = false;
      document.body.style.cursor = "default";
    }
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
  }, [toDraw, isDrawing, selectedShapeConfig]);

  // let once = false;
  // let delta: number = 0;
  // let deltaX: number = 0;
  // let deltaY: number = 0;

  // function moveShape(
  //   shape: SelectedShape<ShapesEnum>,
  //   event: MouseEvent,
  //   context: CanvasRenderingContext2D
  // ) {
  //   if (shape.type === ShapesEnum.Rectangle) {
  //     const { x1, y1, width, height, activeEdge } =
  //       shape as SelectedShape<ShapesEnum.Rectangle>;

  //     const { offsetX, offsetY } = event;

  //     if (!once) {
  //       if (activeEdge === "left" || activeEdge === "right") {
  //         delta = offsetY - y1;
  //       }

  //       if (activeEdge === "bottom" || activeEdge === "top") {
  //         delta = offsetX - x1;
  //       }
  //       once = true;
  //     }

  //     switch (activeEdge) {
  //       case "left": {
  //         const newX1 = offsetX;
  //         const newY1 = offsetY - delta;

  //         context.beginPath();
  //         context.rect(newX1, newY1, width, height);
  //         context.stroke();

  //         setShapesMap(
  //           shapesMap.set(shape.id, {
  //             x1: newX1,
  //             y1: newY1,
  //             height,
  //             width,
  //             id: shape.id,
  //             type: shape.type,
  //           })
  //         );
  //         return;
  //       }
  //       case "right": {
  //         const newX1 = offsetX - width;
  //         const newY1 = offsetY - delta;

  //         context.beginPath();
  //         context.rect(newX1, newY1, width, height);
  //         context.stroke();

  //         setShapesMap(
  //           shapesMap.set(shape.id, {
  //             x1: newX1,
  //             y1: newY1,

  //             height,
  //             width,
  //             id: shape.id,
  //             type: shape.type,
  //           })
  //         );
  //         return;
  //       }
  //       case "top": {
  //         const newX1 = offsetX - delta;
  //         const newY1 = offsetY;

  //         context.beginPath();
  //         context.rect(newX1, newY1, width, height);
  //         context.stroke();

  //         setShapesMap(
  //           shapesMap.set(shape.id, {
  //             x1: newX1,
  //             y1: newY1,
  //             height,
  //             width,
  //             id: shape.id,
  //             type: shape.type,
  //           })
  //         );
  //         return;
  //       }

  //       case "bottom": {
  //         const newX1 = offsetX - delta;
  //         const newY1 = offsetY - height;

  //         context.beginPath();
  //         context.rect(newX1, newY1, width, height);
  //         context.stroke();

  //         setShapesMap(
  //           shapesMap.set(shape.id, {
  //             x1: newX1,
  //             y1: newY1,
  //             height,
  //             width,
  //             id: shape.id,
  //             type: shape.type,
  //           })
  //         );
  //         return;
  //       }
  //       default:
  //         break;
  //     }
  //   } else if (shape.type === ShapesEnum.Line) {
  //     const { x1, y1, x2, y2 } = shape;
  //     const { clientX, clientY } = event;

  //     if (!once) {
  //       once = true;
  //       deltaX = clientX - x1;
  //       deltaY = clientY - y1;
  //     }

  //     const newX1 = clientX - deltaX;
  //     const newY1 = clientY - deltaY;

  //     const newX2 = newX1 + (x2 - x1);
  //     const newY2 = newY1 + (y2 - y1);

  //     // context.beginPath();
  //     // context.moveTo(newX1, newY1);
  //     // context.lineTo(newX2, newY2);
  //     // context.stroke();

  //     drawLine(context, {
  //       type: ShapesEnum.Line,
  //       x1: newX1,
  //       y1: newY1,
  //       x2: newX2,
  //       y2: newY2,
  //       id: shape.id,
  //     });

  //     setShapesMap(
  //       shapesMap.set(shape.id, {
  //         ...shape,
  //         x1: newX1,
  //         y1: newY1,
  //         x2: newX2,
  //         y2: newY2,
  //       })
  //     );
  //   }
  // }

  return canvasConfig;
}

export default useCreateContext;

function hoverOverShapes(
  shapesMap: Map<string, Shape<ShapesEnum>>,
  event: MouseEvent,
  selectShapeToMove: (shape: SelectedShape<ShapesEnum> | undefined) => void,
  context: CanvasRenderingContext2D | null
) {
  //
  for (const [_, shape] of shapesMap) {
    switch (shape.type) {
      case ShapesEnum.Rectangle: {
        const { offsetX: currentX, offsetY: currentY } = event;
        const { x1, y1, height, width } = shape;

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
        break;
      }

      case ShapesEnum.Line: {
        const { offsetX: currentX, offsetY: currentY } = event;
        const { x1, x2, y1, y2 } = shape;
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

        break;
      }

      default:
        // selectShapeToMove(undefined);
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
