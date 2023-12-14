let canvas = document.getElementById('backgroundCanvas'); //canvas
let ctx = canvas.getContext('2d'); //context

ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

//Array stores squares
const squares = [];

//Make squares on load
for(i = 0; i < 30; i++) {
  generateSquare(true);
}

//Generate random squares
function generateSquare(randomY) {
  const size = Math.random() * 30 + 5;
  const x = Math.random() * canvas.width;
  let y;
  if (randomY) {
    y = Math.random() * canvas.height;
  } else {
    y = canvas.height + 50;
  }
  const speed = size / 20;
  const angularSpeed = Math.random() / 25 -0.02;

  squares.push({ x, y, size, speed, angle: 0, angularSpeed });
}

//Draw squares
function drawSquare(square) {
  ctx.save();
  ctx.translate(square.x, square.y);
  ctx.rotate(square.angle);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(-square.size / 2, -square.size / 2, square.size, square.size);
  ctx.restore();
}

//Animation loop
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Generate squares
    if (Math.random() < 0.05) {
        generateSquare(false);
    }

    for (let i = squares.length - 1; i >= 0; i--) {
        const square = squares[i];

        square.y -= square.speed;
        square.angle += square.angularSpeed;

        //Delete
        if (square.y + square.size / 2 < 0) {
            squares.splice(i, 1);
        }

        drawSquare(square);
    }
}

//Start animation
setInterval(draw, 10);