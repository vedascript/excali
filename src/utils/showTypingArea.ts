function getTypingArea(event: MouseEvent) {
  const x1 = event.offsetX;
  const y1 = event.offsetY + 80;

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
  textArea.style.font = "1.2rem 'Fira Sans', sans-serif";
  textArea.style.border = "1px solid #000";
  const body = document.querySelector("body");
  body?.appendChild(textArea);

  setTimeout(() => {
    textArea.focus();
  }, 200);

  return { typingArea: textArea, x1: event.offsetX - 3, y1: event.offsetY + 2 };
}

export default getTypingArea;
