import { useRef, useState } from "react";

import { Toolbar } from "./components";
import { useCreateContext } from "./hooks";
import { DrawingConfig, ShapesMap, initDrawingConfig } from "./types";
import drawExistingShapes from "./utils/drawExistingShapes";

import "./App.css";

function App() {
  const [drawingConfig, setDrawingConfig] =
    useState<DrawingConfig>(initDrawingConfig);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [redoShapes, setRedoShapes] = useState<ShapesMap>(new Map());
  const [shapesMap, setShapesMap] = useState<ShapesMap>(new Map());

  const { context, canvasHeight, canvasWidth } = useCreateContext(
    canvasRef,
    drawingConfig,
    shapesMap,
    setShapesMap,
    setDrawingConfig
  );

  function undo(shapes: ShapesMap, context: CanvasRenderingContext2D | null) {
    if (shapes.size && context) {
      const shapesArr = Array.from(shapes.entries());
      const undoneShape = shapesArr.pop();

      if (undoneShape) {
        setRedoShapes(redoShapes.set(undoneShape[0], undoneShape[1]));
      }

      const updatedShapesMap = new Map(shapesArr);
      setShapesMap(updatedShapesMap);

      context.clearRect(0, 0, canvasWidth, canvasHeight);
      drawExistingShapes(updatedShapesMap, context);
    }
  }

  function redo() {
    if (redoShapes.size && context) {
      const redoShapesArr = Array.from(redoShapes.entries());
      const shapeToRedo = redoShapesArr.pop();

      setRedoShapes(new Map(redoShapesArr));

      if (shapeToRedo) {
        const updatedShapesMap = shapesMap.set(shapeToRedo[0], shapeToRedo[1]);
        setShapesMap(updatedShapesMap);

        context.clearRect(0, 0, canvasWidth, canvasHeight);
        drawExistingShapes(updatedShapesMap, context);
      }
    }
  }

  return (
    <>
      <Toolbar
        activeShape={drawingConfig.toDraw}
        setToDraw={setDrawingConfig}
      />
      <button onClick={() => undo(shapesMap, context)}>undo</button>
      <button onClick={redo}>redo</button>
      <canvas ref={canvasRef}></canvas>
    </>
  );
}

export default App;
