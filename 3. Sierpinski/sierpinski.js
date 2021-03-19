class triangle {
  constructor(v1, v2, v3) {
    this.v1 = v1;
    this.v2 = v2;
    this.v3 = v3;
  };

  draw(context) {
    context.fillStyle = "green";
    context.beginPath();
    context.moveTo(this.v1.x, this.v1.y);
    context.lineTo(this.v2.x, this.v2.y);
    context.lineTo(this.v3.x, this.v3.y);
    context.closePath();
    context.fill();
  }
}

function clearCanvas(context, canvas) {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function getNewCoords(v1, v2){
  const newX = (v1.x + v2.x) / 2;
  const newY = (v1.y + v2.y) / 2;
  return {x:newX, y:newY}
}

function updateTriangles(context, subdivs, v1, v2, v3){
    if(subdivs>1){
      const newSubdivs = --subdivs;
      const newV1 = getNewCoords(v2, v3);
      const newV2 = getNewCoords (v1, v3);
      const newV3 = getNewCoords (v1, v2);
      updateTriangles(context, newSubdivs, v1, newV2, newV3);
      updateTriangles(context, newSubdivs, newV1, v2, newV3);
      updateTriangles(context, newSubdivs, newV1, newV2, v3);
    }else{
      const triangles = new triangle(v1, v2, v3);
      triangles.draw(context);
    }
}

function main() {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  const slider = document.getElementById("iterations");
  const output = document.getElementById("subdivsText");
  output.innerHTML = slider.value;
  const initV1 = {x:canvas.width/2, y:0}
  const initV2 = {x:0, y:canvas.height}
  const initV3 = {x:canvas.width, y:canvas.height}

  slider.oninput = function () {
    clearCanvas(context, canvas);
    output.innerHTML = this.value;
    updateTriangles(context, this.value, initV1, initV2, initV3);
  }
}
