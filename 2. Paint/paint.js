function clearCanvas(context, canvas) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  console.log("Borrar")
}

function main() {
  const canvas = document.getElementById("paintCanvas");
  const context = canvas.getContext("2d");
  var slider = document.getElementById("widthSlider");
  let output = document.getElementById("widthText");
  output.innerHTML = slider.value;

  slider.oninput = function () {
    output.innerHTML = this.value;
  };

  document.getElementById("clearBtn").addEventListener("click", clearCanvas(context, canvas));
}

