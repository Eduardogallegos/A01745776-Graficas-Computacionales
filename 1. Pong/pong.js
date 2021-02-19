class ball {
  constructor(x, y, radius, dirX, dirY) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dirX = dirX;
    this.dirY = dirY;
    // this.possibleSpeeds = [1,2,3,4,5]
  }

  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    context.fillStyle = "white";
    context.fill();
  }

  changeDirX() {
    this.dirX *= -1;
  }

  changeDirY() {
    this.dirY *= -1;
  }

  move() {
    this.x += 3 * this.dirX;
    this.y += 1 * this.dirY;
  }

  keepBallInBounds(canvas) {
    if (this.x < this.radius) {
      this.x = this.radius;
      this.changeDirX();
    } else if (this.x > canvas.width - this.radius) {
      this.x = canvas.width - this.radius;
      this.changeDirX();
    }

    if (this.y < this.radius) {
      this.y = this.radius;
      this.changeDirY();
    } else if (this.y > canvas.height - this.radius) {
      this.y = canvas.height - this.radius;
      this.changeDirY();
    }
  }

  checkBarsPos(leftBar, rightBar) {
    // Ball coords
    let leftBallX = this.x;
    let rightBallX = this.x + this.radius * 2;
    let ballY = this.y + this.radius;

    // Left bar coords
    let leftBarX = leftBar.getBarX() + leftBar.getBarWidth();
    let leftBarTop = leftBar.getBarY();
    let leftBarBottom = leftBar.getBarY() + leftBar.getBarHeight();

    // Right bar coords
    let rightBarX = rightBar.getBarX() + rightBar.getBarWidth();
    let rightBarTop = rightBar.getBarY();
    let rightBarBottom = rightBar.getBarY() + rightBar.getBarHeight();

    if (leftBallX <= leftBarX) {
      if (ballY >= leftBarTop && ballY <= leftBarBottom) {
        this.changeDirX();
      }
    } else if (rightBallX >= rightBarX) {
      if (ballY >= rightBarTop && ballY <= rightBarBottom) {
        this.changeDirX();
      }
    }
  }

  update(canvas, leftBar, rightBar) {
    this.keepBallInBounds(canvas);
    this.checkBarsPos(leftBar, rightBar);
    this.move();
  }
}

class bar {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw(context) {
    context.fillStyle = "white";
    context.fillRect(this.x, this.y, this.width, this.height);
  }

  getBarX() {
    return this.x;
  }

  getBarY() {
    return this.y;
  }

  getBarWidth() {
    return this.width;
  }

  getBarHeight() {
    return this.height;
  }

  moveUp() {
    this.y -= 3;
  }

  moveDown() {
    this.y += 3;
  }

  checkOutOfBounds() {
    return false;
  }

  update(keysDown, side) {
    if (!this.checkOutOfBounds()) {
      if (side == "left") {
        if (keysDown["q"]) this.moveUp();
        else if (keysDown["a"]) this.moveDown();
      } else {
        if (keysDown["p"]) this.moveUp();
        else if (keysDown["l"]) this.moveDown();
      }
    }
  }
}

let keysDown = {
  q: false,
  a: false,
  p: false,
  l: false,
};

function update(context, canvas, leftBar, rightBar, gameBall) {
  requestAnimationFrame(() =>
    update(context, canvas, leftBar, rightBar, gameBall)
  );

  context.clearRect(0, 0, canvas.width, canvas.height);

  leftBar.update(keysDown, "left");
  rightBar.update(keysDown, "right");
  gameBall.update(canvas, leftBar, rightBar);

  leftBar.draw(context);
  rightBar.draw(context);
  gameBall.draw(context);
}

function main() {
  // Obtener el contexto para dibujar
  const canvas = document.getElementById("pongCanvas");
  const context = canvas.getContext("2d");

  let barHeight = canvas.height / 3;
  let barWidth = 20;
  let initBarsY = canvas.height / 3;
  let leftBarX = 15;
  let rightBarX = canvas.width - (barWidth + leftBarX);

  const leftBar = new bar(leftBarX, initBarsY, barWidth, barHeight);
  const rightBar = new bar(rightBarX, initBarsY, barWidth, barHeight);

  let ballX = canvas.width / 2;
  let ballY = canvas.height / 2;
  let radius = 10;
  let possibleDirs = [-1, 1]; // left, right
  let ballDirX = possibleDirs[Math.floor(Math.random() * possibleDirs.length)];
  let ballDirY = possibleDirs[Math.floor(Math.random() * possibleDirs.length)];

  const gameBall = new ball(ballX, ballY, radius, ballDirX, ballDirY);

  document.addEventListener("keydown", (event) => (keysDown[event.key] = true));
  document.addEventListener("keyup", (event) => (keysDown[event.key] = false));

  update(context, canvas, leftBar, rightBar, gameBall);
}
