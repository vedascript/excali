function drawText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number
) {
  const lineHeight = 20;
  const lines = text.split("\n");
  context.font = "16px sans-serif";

  for (let i = 0; i < lines.length; i++) {
    context.fillText(lines[i], x, y + i * lineHeight);
  }
}

export default drawText;
