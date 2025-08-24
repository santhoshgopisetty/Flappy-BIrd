let board;
let context;
let boardWidth = 360;
let boardHeight = 640;

let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2.5;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    height: birdHeight,
    width: birdWidth
}

let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;
let topPipeImg;
let bottomPipeImg;

let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

let gameOverImg;
let playImg;

let gameStarted = false;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    birdImg = new Image();
    birdImg.src = "Images/flappybird.png";

    topPipeImg = new Image();
    topPipeImg.src = "Images/toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "Images/bottompipe.png";

    gameOverImg = new Image();
    gameOverImg.src = "Images/flappy-gameover.png";

    playImg = new Image();
    playImg.src = "Images/flappyBirdPlayButton.png";

    playImg.onload = showPlayButton;

    document.addEventListener("keydown", moveBird);

    board.addEventListener("touchstart", function (e) {
        e.preventDefault();
        if (!gameStarted) startGame();
        else jumpBird();
    });

    board.addEventListener("click", function () {
        if (!gameStarted) startGame();
    });
};

function showPlayButton() {
    context.clearRect(0, 0, boardWidth, boardHeight);

    const imgWidth = 200;
    const imgHeight = 80;
    const x = (boardWidth - imgWidth) / 2;
    const y = (boardHeight - imgHeight) / 2;

    context.drawImage(playImg, x, y, imgWidth, imgHeight);

    context.fillStyle = "black";
    context.font = "24px Arial";
    context.textAlign = "center";
    context.fillText("Click or Tap to Play", boardWidth / 2, y + imgHeight + 40);
}

function startGame() {
    gameStarted = true;
    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
}

function update() {
    requestAnimationFrame(update);
    if (!gameStarted) return;

    if (gameOver) {
        context.drawImage(gameOverImg, (boardWidth - 300) / 2, 200, 300, 100);
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);

    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) gameOver = true;

    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) gameOver = true;
    }

    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    context.fillStyle = "white";
    context.font = "45px Roboto";
    context.fillText(score, 25, 45);
}

function placePipes() {
    if (!gameStarted || gameOver) return;

    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(bottomPipe);
}

function jumpBird() {
    velocityY = -6;

    if (gameOver) {
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        gameOver = false;
    }
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        jumpBird();
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}