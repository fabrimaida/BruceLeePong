// Let's start
const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Let's define the user
const user = {
  x: 0,
  y: canvas.height/2 - 50,
  width: 10,
  height: 100,
  color: "red",
  score: 0
}

// Now let's define the com/CPU.

const com = {
  x: canvas.width - 10,
  y: canvas.height/2 - 50,
  width: 10,
  height: 100,
  color: "blue",
  score: 0
}

// Here we draw the net at the middle

const net = {
  x : canvas.width/2 - 2/2,
  y : 0,
  width : 2,
  height : 10,
  color: "white",
}
function drawNet() {
  for(let i = 0; i <= canvas.height; i+=15){
    drawRect(net.x, net.y + i, net.width, net.height, net.color)
  }
}

// WE MUST CREATE THE BALL!

const ball = {
  x : canvas.width/2,
  y : canvas.height/2,
  radius : 10,
  color : "white",
  speed : 5,
  velocityX : 5,
  velocityY : 5,
}

// Let's draw a circle for the ball
function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0 ,Math.PI*2, false);
  ctx.closePath();
  ctx.fill();
}

// Now we need the rectangle, function for this!

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

// In the end we need to draw somewhere the score.

function drawText(text, x, y, color) {
  ctx.fillStyle = color;
  ctx.font = "50px fantasy";
  ctx.fillText(text, x, y);
}
// NOW RENDER THE GAME! Here we merge everything! Alles Gut!

function render(){
  drawRect(0,0,canvas.width, canvas.height, "black");
  drawText(user.score, canvas.width/4, canvas.height/8, "red");
  drawText(com.score, 2.8*canvas.width/4, canvas.height/8, "blue");
  drawNet();
  drawRect( user.x, user.y, user.width, user.height, user.color);
  drawRect( com.x, com.y, com.width, com.height, com.color);
  drawCircle(ball.x, ball.y, ball.radius, ball.color);
}
// Here we move the ball. Not easy....we will play with the velocity on the x and y axis

function update() {
  ball.x += velocityX;
  ball.y += velocityY;
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    velocityY = - velocityY;
  }

  // Some collision detection here.
  // This is going to be a little confusing, but basically we will get a boolean out of a function
  // that detects if the ball or the paddles are at the same space in X and Y with the final return

  if (collision ( ball, player)) {
    let collidePoint = (ball.y - (player.y + player.height/2));
    collidePoint = collidePoint / (player.height/2);
    let angleRad = (Math.PIC/4) * collidePoint;

    let direction = (ball.x < canvas.width/2) ? 1 : -1;

    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);

    ball.velocityX =  0.1;
  }
}

// And now the function for the collision

  function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;

    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    return b.right > p.left && b.top < p.bottom && b.left < p.right && b.bottom > p.top;
  }

// Here we make everything to controll the user's paddle

canvas.addEventListener("mousemove", movePaddle);

function movePaddle(evt) {
  let rect = canvas.getBoundingClientRect();
  user.y = evt.clientY - rect.top - user.height/2;
}

// And now we need the hardest thing, a simple but still challenging IA for the Com paddle....
// We will do this the easy way

let computerLevel = 0.05;

com.y += (ball.y- (com.y + com.height/2)) * computerLevel;


// Now the core, we will use a function that draw the ball in different position according
// to speed, direction on the X and the Y axis

function update() {
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  // Retrieve the IA
  let computerLevel = 0.85;
  com.y += (ball.y- (com.y + com.height/2)) * computerLevel;
  if( ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.velocityY = - ball.velocityY
  }
  let player = ( ball.x < canvas.width/2) ? user : com ;

  if(collision(ball,player)){
    // The core of the game here, where the ball hit the player
    let collidePoint = ball.y - (player.y + player.height/2);
    // change direction when white
    let direction = (ball.x < canvas.width/2) ? 1 : -1;
    // normalization
    collidePoint = collidePoint/(player.height/2);
    // calculate the angleRad
    let angleRad = collidePoint * Math.PI/4;
    // change vel x and Y
    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = direction * ball.speed * Math.sin(angleRad);
    // everytime the ball is hit
    if (ball.speed <=9.8) {
      ball.speed += 3.2;
    }
  }

  // update the score

  if (ball.x - ball.radius < 0) {
    com.score++;
    resetBall();
  } else if (ball.x + ball.radius > canvas.width) {
    user.score++;
    resetBall();
  }
}


// Game Init
const btn = document.getElementById("btn");
const btnReset = document.getElementById("resetbtn");
console.log(btn);

btn.addEventListener("click", function () {
  function game() {
    render();
    update();
  }
btn.classList.add("hidden");
btnReset.classList.remove("hidden");

const framePerSecond = 60;
setInterval(game, 1000/framePerSecond);
});

btnReset.addEventListener("click", function () {
  resetBallAndScore();
})
// // Game Init
// const btn = document.getElementById("btn");
// console.log(btn);
//
// btn.addEventListener("click", function () {
//   if (ball.speed <= 6.0) {
//     function game() {
//       render();
//       update();
//     }
//     const framePerSecond = 50;
//     setInterval(game, 1000/framePerSecond);
//   }
//   // else if (ball.speed >= 0) {
//   //   resetBallAndScore();
//   // }
//
// });

// // Here we update the score and of course the function to reset the BALL

function resetBall() {
  ball.x = canvas.width/2;
  ball.y = canvas.height/2;
  ball.speed = 5;
  ball.velocityX = -ball.velocityX;
}

function resetBallAndScore() {
  ball.x = canvas.width/2;
  ball.y = canvas.height/2;
  ball.speed = 5;
  ball.velocityX = -ball.velocityX;
  com.score = 0;
  user.score = 0;
}


setInterval(function () {
  console.log(ball.speed);
}, 5000);
