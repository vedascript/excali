import { RefObject, useEffect, useState } from "react";

function useCreateContext(canvasRef: RefObject<HTMLCanvasElement>) {
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      setContext(canvasRef.current.getContext("2d"));

      canvasRef.current.width = document.body.clientWidth;
      canvasRef.current.height = document.body.scrollHeight;
    }
  }, [canvasRef]);

  return [context];
}

export default useCreateContext;
