import { Dispatch, FC, SetStateAction } from "react";

import { DrawingConfig, ShapesEnum } from "../types";

import rectangle from "../assets/rectangle.svg";
import straightLine from "../assets/straightLine.svg";

type Props = {
  activeShape: ShapesEnum | undefined;
  setToDraw: Dispatch<SetStateAction<DrawingConfig>>;
};

const Toolbar: FC<Props> = ({ activeShape, setToDraw }) => {
  function setShapeToDraw(shape: ShapesEnum) {
    setToDraw((prev) => ({ ...prev, toDraw: shape }));
  }

  return (
    <div className="container mx-auto rounded-md border-2 border-zinc-120 border-solid shadow-sm p-2 mt-5 max-w-screen-sm flex flex-row items-center gap-x-2">
      <button
        className={`hover:bg-violet-300/30 rounded-md p-1.5 ${
          activeShape === ShapesEnum.Rectangle && "bg-red-400"
        }`}
        onClick={() => setShapeToDraw(ShapesEnum.Rectangle)}
      >
        <img src={rectangle} />
      </button>

      <button
        className={`hover:bg-violet-300/30 rounded-md p-1.5 ${
          activeShape === ShapesEnum.Line && "bg-red-400"
        }`}
        onClick={() => setShapeToDraw(ShapesEnum.Line)}
      >
        <img src={straightLine} />
      </button>

      <button onClick={() => setShapeToDraw(ShapesEnum.Text)}>Text</button>

      <button onClick={() => setShapeToDraw(ShapesEnum.Pen)}>Pen</button>
    </div>
  );
};

export default Toolbar;
