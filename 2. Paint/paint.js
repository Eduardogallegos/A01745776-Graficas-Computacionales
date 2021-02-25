function checkSlider(context) {
  let slider = document.getElementById("widthSlider");
  let output = document.getElementById("widthText");
  output.innerHTML = slider.value;

  slider.oninput = function () {
    output.innerHTML = this.value;
    context.lineWidth = this.value;
  };
}

function clearCanvas(context, canvas) {
  document.getElementById("clearBtn").addEventListener("click", () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
  });
}

function setCorrectMouseCoords(
  eventMouseX,
  eventMouseY,
  canvasLeft,
  canvasTop
) {
  return { x: eventMouseX - canvasLeft, y: eventMouseY - canvasTop };
}

function changeColor(context) {
  let colors = [
    "blueBtn",
    "redBtn",
    "greenBtn",
    "orangeBtn",
    "purpleBtn",
    "blackBtn",
    "pinkBtn",
    "greyBtn",
  ];
  colors.forEach((id) => {
    let color = document.getElementById(id);
    color.addEventListener("click", (event) => {
      context.strokeStyle = event.target.value || "black";
    });
  });
};

function main() {
  // Obtener el contexto para dibujar
  const canvas = document.getElementById("paintCanvas");
  const context = canvas.getContext("2d");

  // obteniendo coordenadas del rectangulo para precisar el trazo
  const canvasCoords = canvas.getBoundingClientRect();
  const canvasLeft = canvasCoords.left;
  const canvasTop = canvasCoords.top;

  // Config del mouse
  let mouseX = 0;
  let mouseY = 0;
  context.strokeStyle = "black";
  context.lineWidth = 1;
  let isDrawing = false;

  canvas.addEventListener("mousedown", (event) => {
    let mouseCoords = setCorrectMouseCoords(
      event.clientX,
      event.clientY,
      canvasLeft,
      canvasTop
    );
    mouseX = mouseCoords.x;
    mouseY = mouseCoords.y;
    isDrawing = true;
    context.beginPath();
    context.moveTo(mouseX, mouseY);
  });

  canvas.addEventListener("mouseup", (event) => {
    isDrawing = false;
  });

  canvas.addEventListener("mousemove", (event) => {
    let mouseCoords = setCorrectMouseCoords(
      event.clientX,
      event.clientY,
      canvasLeft,
      canvasTop
    );
    mouseX = mouseCoords.x;
    mouseY = mouseCoords.y;
    if (isDrawing) {
      context.lineTo(mouseX, mouseY);
      context.stroke();
    }
  });

  checkSlider(context);
  clearCanvas(context, canvas);
  changeColor(context);
}
