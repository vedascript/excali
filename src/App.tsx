import { useRef } from "react";
import "./App.css";
import { useCreateContext } from "./hooks";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context] = useCreateContext(canvasRef);

  if (context) {
    context.strokeStyle = "red";
    context.rect(30, 500, 200, 300);
    context.stroke();
  }

  return (
    <>
      <canvas ref={canvasRef}></canvas>
    </>
  );
}

export default App;
