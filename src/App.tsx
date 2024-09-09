import { useRef, useState } from "react";

import { Toolbar } from "./components";
import { useCreateContext } from "./hooks";
import {
  DrawingConfig,
  LineCoord,
  PenCoordinate,
  RectangleCoord,
  RedoShape,
  Shape,
  ShapesEnum,
  ShapesMap,
  initDrawingConfig,
} from "./types";
import drawExistingShapes from "./utils/drawExistingShapes";
import { isNotPen, isPen, isRedoShapePen } from "./utils";

import undoIcon from "./assets/undo.svg";
import redoIcon from "./assets/redo.svg";

import "./App.css";

function App() {
  const [drawingConfig, setDrawingConfig] =
    useState<DrawingConfig>(initDrawingConfig);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeShapeIds = useRef<string[]>([]);

  const [shapesMap, setShapesMap] = useState<ShapesMap>(new Map());
  const [redoShapes, setRedoShapes] = useState<Array<RedoShape>>([]);

  const { context, canvasHeight, canvasWidth } = useCreateContext(
    canvasRef,
    drawingConfig,
    shapesMap,
    activeShapeIds,
    setShapesMap,
    setDrawingConfig
  );

  function undo(shapes: ShapesMap, context: CanvasRenderingContext2D | null) {
    if (!canUndo(shapes, context)) return;
    const activeShapeId = activeShapeIds.current.pop() as string;
    const shapesMapClone = new Map(shapes);
    const activeShape = shapesMapClone.get(activeShapeId) as Shape<ShapesEnum>;

    let undoCoordinate:
      | RectangleCoord
      | LineCoord
      | PenCoordinate[]
      | undefined;

    if (isPen(activeShape)) {
      undoCoordinate = [...activeShape.coordinates];
      activeShape.coordinates = [];
    } else if (isNotPen(activeShape)) {
      undoCoordinate = activeShape.coordinates.pop();
    }

    if (!undoCoordinate) return;

    if (!activeShape.coordinates.length) {
      shapesMapClone.delete(activeShapeId);
    }

    redrawCanvas(context as CanvasRenderingContext2D, shapesMapClone);
    updateRedoShape(
      undoCoordinate as RectangleCoord | LineCoord | PenCoordinate[],
      activeShape
    );
    setShapesMap(shapesMapClone);
  }

  function canUndo(
    shapes: ShapesMap,
    context: CanvasRenderingContext2D | null
  ) {
    return shapes.size && context && activeShapeIds.current.length;
  }

  function redrawCanvas(context: CanvasRenderingContext2D, shapes: ShapesMap) {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    drawExistingShapes(shapes, context);
  }

  function updateRedoShape(
    undoCoordinates: RectangleCoord | LineCoord | PenCoordinate[],
    activeShape: Shape<ShapesEnum>
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { coordinates, ...activeShapeWithouthCoordinates } = activeShape;

    const shape: RedoShape = {
      ...activeShapeWithouthCoordinates,
      coordinate: undoCoordinates,
    };

    setRedoShapes([...redoShapes, shape]);
  }

  function redo() {
    if (!redoShapes.length) return;

    const shapesToRedo = [...redoShapes];
    const redoShape = shapesToRedo.pop() as RedoShape;

    const shapesMapClone = getUpdatedShapesMap(redoShape);
    redrawCanvas(context as CanvasRenderingContext2D, shapesMapClone);
    setShapesMap(shapesMapClone);
    setRedoShapes(shapesToRedo);

    activeShapeIds.current.push(redoShape.id);
  }

  function getUpdatedShapesMap(redoShape: RedoShape): ShapesMap {
    const shapesMapClone = new Map(shapesMap);
    const existingShape = shapesMapClone.get(redoShape.id) as Shape<ShapesEnum>;

    if (isRedoShapePen(redoShape)) {
      const penCoordinates = redoShape.coordinate as PenCoordinate[];
      shapesMapClone.set(redoShape.id, {
        ...redoShape,
        coordinates: penCoordinates,
      });
    } else {
      shapesMapClone.set(redoShape.id, {
        ...redoShape,
        coordinates: existingShape
          ? ([
              ...existingShape.coordinates,
              redoShape.coordinate,
            ] as RectangleCoord[])
          : ([redoShape.coordinate] as RectangleCoord[]),
      });
    }

    return shapesMapClone;
  }

  return (
    <>
      <Toolbar
        activeShape={drawingConfig.toDraw}
        setToDraw={setDrawingConfig}
      />
      <canvas ref={canvasRef}></canvas>

      <section className="absolute right-4 bottom-6 flex gap-4 p-2 rounded-md z-20">
        <button
          onClick={() => undo(shapesMap, context)}
          className="bg-link-active hover:bg-link-active"
        >
          <img src={undoIcon} />
        </button>

        <button
          onClick={() => redo()}
          className="bg-link-active hover:bg-link-active"
        >
          <img src={redoIcon} />
        </button>
      </section>
    </>
  );
}

export default App;
