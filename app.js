const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 10;
const PADDLE_MARGIN_BOTTOM = 20;
const BALL_RADIUS = 8;
const a = new Image;
a.src = "nun.jpg";
let leftArrow = false;
let rightArrow = false;
let LIFE = 3;
let SCORE = 0;
let SCORE_UNIT = 10;
let LEVEL = 1;
let MAX_LEVEL = 3;
let GAME_OVER = false;
const paddle = {
    x: cvs.width / 2 - PADDLE_WIDTH / 2,
    y: cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dx: 9

}
const brick = {
    row: 1,
    column: 5,
    width: 55,
    height: 20,
    offSetLeft: 20,
    offSetTop: 40,
    marginTop: 100,
    fillColor: "brown",
    strokeColor: "orange"
}
let bricks = [];
function createBricks() {
    for (let r = 0; r < brick.row; r++) {
        bricks[r] = [];
        for (let c = 0; c < brick.column; c++) {
            bricks[r][c] = {
                x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
                y: r * (brick.offSetTop + brick.height) + brick.offSetTop,
                status: true

            }
        }
    }
}
createBricks();
function drawBricks() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            let b = bricks[r][c];
            if (b.status) {
                ctx.shadowColor="orange" ;
                ctx.shadowColor=40 ;
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(b.x, b.y, brick.width, brick.height);

                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(b.x, b.y, brick.width, brick.height);
            }
        }
    }
}
function bbc() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            let b = bricks[r][c];
            if (b.status) {
                if (ball.x + ball.radius > b.x && ball.x + ball.radius <
                    b.x + brick.width && ball.y + ball.radius > b.y &&
                    ball.y - ball.radius < b.y + brick.height) {
                    ball.dy = -ball.dy;
                    b.status = false;
                    SCORE += SCORE_UNIT;
                }
            }
        }
    }
}
function drawPaddle() {
    ctx.shadowColor="red" ;
    ctx.shadowBlur=40 ;
    ctx.fillStyle = "pink";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    
    ctx.strokeStyle = "purple";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
    
}

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        leftArrow = true;
    }
    else if (event.key === "ArrowRight") {
        rightArrow = true;
    }
});
document.addEventListener("keyup", function (event) {
    if (event.key === "ArrowLeft") {
        leftArrow = false;
    }
    else if (event.key === "ArrowRight") {
        rightArrow = false;
    }
});
function movePaddle() {
    if (rightArrow && paddle.x + paddle.width < cvs.width) {
        paddle.x += paddle.dx + 4;
    }
    else if (leftArrow && paddle.x > 0) {
        paddle.x -= paddle.dx + 5;
    }


}
const ball = {
    x: cvs.width / 2,
    y: paddle.y - BALL_RADIUS,
    radius: BALL_RADIUS,
    speed: 5,
    dx: 3 * (Math.random() * 2 - 1),
    dy: -3
}
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.shadowBlur=30 ;
    ctx.shadowColor="yellow" ;
    ctx.fillStyle = "yellow";
    ctx.fill();

    ctx.strokeStyle = "orange";
    ctx.stroke();
    ctx.closePath();
}
function sgp(text, textX, textY) {
    ctx.fillStyle = "purple";
    ctx.font = "25px Germania One";
   // ctx.font = "25px verdana";
    ctx.shadowColor = "blue";
    
   // ctx.lineWidth = 5;
    ctx.strokeText(text, textX,textY );
    ctx.shadowBlur = 40;
    ctx.fillStyle = "white";
    ctx.fillText(text, textX, textY);
}
function levelUp() {
    let isLevelDone = true;
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            isLevelDone = isLevelDone && !bricks[r][c].status;
        }
    }
    if (isLevelDone) {
        if (LEVEL >= MAX_LEVEL) {
            GAME_OVER = true;
            sgp("WIN WIN !!!", cvs.width / 2 - 45, cvs.height / 2);
            return;
        }
        brick.row++;
        createBricks();
        ball.speed += 0.5;
        resetball();
        LEVEL++;

    }
}
function draw() {
    drawPaddle();
    drawBall();
    drawBricks();
    sgp("Score: " + SCORE, 35, 25);
    sgp("Life: " + LIFE, cvs.width - 85, 25);
    sgp("Level: " + LEVEL, cvs.width / 2 - 40, 25);
}
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

}
function go() {
    if (LIFE <= 0) {
        GAME_OVER = true;
        sgp("Game Over", cvs.width / 2 - 40, cvs.height / 2);
        sgp("Refresh to PLAY AGAIN", cvs.width / 2 - 100, cvs.height / 2 + 30);
    }
}
function update() {
    movePaddle();
    moveBall();
    bwc();
    bpc();
    bbc();
    levelUp();
    go();
}
function bpc() {
    if (ball.x < paddle.x + paddle.width && ball.x > paddle.x &&
        ball.y < paddle.y + paddle.height &&
        ball.y > paddle.y) {
        let cp = ball.x - (paddle.x + paddle.width / 2);
        cp = cp / (paddle.width / 2);

        let angle = cp * Math.PI / 3;

        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = -ball.speed * Math.cos(angle);
    }
}
function resetball() {
    ball.x = cvs.width / 2;
    ball.y = paddle.y - BALL_RADIUS;
    ball.dx = 3 * (Math.random() * 2 - 1);
    ball.dy = -3;
}
function bwc() {
    if (ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
    }
    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }
    if (ball.y + ball.radius > cvs.height) {
        LIFE--;
        resetball();
    }

}
function loop() {
    ctx.drawImage(a, 0, 0, 500, 500);
    draw();
    update();
    if (!GAME_OVER)
        requestAnimationFrame(loop);
}
loop();