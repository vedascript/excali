function getTypingArea(event: MouseEvent) {
  const x1 = event.offsetX;
  const y1 = event.offsetY;

  const textArea = document.createElement("span");
  textArea.setAttribute("role", "textbox");
  textArea.setAttribute("contenteditable", "");
  textArea.style.position = "absolute";
  textArea.style.top = `${y1}px`;
  textArea.style.left = `${x1}px`;
  textArea.style.display = "inline-block";
  textArea.style.minWidth = `16px`;
  textArea.style.minHeight = "16px";
  textArea.style.outline = "none";
  textArea.style.zIndex = "2";
  textArea.style.font = "16px sans-serif";
  textArea.style.cursor = "text";

  const body = document.querySelector("body");
  body?.appendChild(textArea);

  setTimeout(() => {
    textArea.focus();
  }, 200);

  return { typingArea: textArea, x1: event.offsetX, y1: event.offsetY + 20 };
}

export default getTypingArea;
