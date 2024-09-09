import { Dispatch, FC, SetStateAction } from "react";

import { DrawingConfig, ShapesEnum } from "../types";

import { rectangle, straightLine, pencil, text } from "../assets";

type Props = {
  activeShape: ShapesEnum | undefined;
  setToDraw: Dispatch<SetStateAction<DrawingConfig>>;
};

const Toolbar: FC<Props> = ({ activeShape, setToDraw }) => {
  function setShapeToDraw(shape: ShapesEnum) {
    setToDraw((prev) => ({ ...prev, toDraw: shape }));
  }

  return (
    <div className="flex w-fit mx-auto rounded-md border-2 border-zinc-120 border-solid shadow-sm p-2 my-5 items-center gap-2 absolute inset-x-0 z-10">
      <button
        className={`rounded-md p-2  ${
          activeShape === ShapesEnum.Rectangle
            ? "bg-violet-300"
            : "hover:bg-violet-300/30"
        }`}
        onClick={() => setShapeToDraw(ShapesEnum.Rectangle)}
      >
        <img src={rectangle} />
      </button>

      <button
        className={`rounded-md p-2  ${
          activeShape === ShapesEnum.Line
            ? "bg-violet-300"
            : "hover:bg-violet-300/30"
        }`}
        onClick={() => setShapeToDraw(ShapesEnum.Line)}
      >
        <img src={straightLine} />
      </button>

      <button
        className={`rounded-md p-2  ${
          activeShape === ShapesEnum.Text
            ? "bg-violet-300"
            : "hover:bg-violet-300/30"
        }`}
        onClick={() => setShapeToDraw(ShapesEnum.Text)}
      >
        <img src={text} />
      </button>

      <button
        className={`rounded-md p-2  ${
          activeShape === ShapesEnum.Pen
            ? "bg-violet-300"
            : "hover:bg-violet-300/30"
        }`}
        onClick={() => setShapeToDraw(ShapesEnum.Pen)}
      >
        <img src={pencil} />
      </button>
    </div>
  );
};

export default Toolbar;
