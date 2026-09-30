// =====================================
// POLYTACK GAME
// =====================================


const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");


// =====================================
// CANVAS
// =====================================

canvas.width = 800;

canvas.height = 500;


// =====================================
// GAME VARIABLES
// =====================================

let score = 0;

let lives = 3;

let keys = {};


// =====================================
// PLAYER
// =====================================

const player = {

    x: 100,

    y: 235,

    width: 30,

    height: 30,

    speed: 5

};


// =====================================
// COIN
// =====================================

const coin = {

    x: 600,

    y: 200,

    radius: 12

};


// =====================================
// ENEMY
// =====================================

const enemy = {

    x: 400,

    y: 100,

    width: 30,

    height: 30,

    speedX: 2,

    speedY: 2

};


// =====================================
// KEYBOARD INPUT
// =====================================

document.addEventListener(
    "keydown",
    function(event) {

        keys[
            event.key.toLowerCase()
        ] = true;

    }
);


document.addEventListener(
    "keyup",
    function(event) {

        keys[
            event.key.toLowerCase()
        ] = false;

    }
);


// =====================================
// PLAYER MOVEMENT
// =====================================

function movePlayer() {


    if (
        keys["w"] ||
        keys["arrowup"]
    ) {

        player.y -= player.speed;

    }


    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {

        player.y += player.speed;

    }


    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {

        player.x -= player.speed;

    }


    if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        player.x += player.speed;

    }


    // LEFT WALL

    if (player.x < 0) {

        player.x = 0;

    }


    // TOP WALL

    if (player.y < 0) {

        player.y = 0;

    }


    // RIGHT WALL

    if (
        player.x + player.width >
        canvas.width
    ) {

        player.x =
            canvas.width -
            player.width;

    }


    // BOTTOM WALL

    if (
        player.y + player.height >
        canvas.height
    ) {

        player.y =
            canvas.height -
            player.height;

    }

}


// =====================================
// ENEMY MOVEMENT
// =====================================

function moveEnemy() {


    enemy.x += enemy.speedX;

    enemy.y += enemy.speedY;


    if (
        enemy.x <= 0 ||
        enemy.x + enemy.width >=
        canvas.width
    ) {

        enemy.speedX *= -1;

    }


    if (
        enemy.y <= 0 ||
        enemy.y + enemy.height >=
        canvas.height
    ) {

        enemy.speedY *= -1;

    }

}


// =====================================
// RECTANGLE COLLISION
// =====================================

function rectangleCollision(
    a,
    b
) {

    return (

        a.x <
        b.x + b.width &&

        a.x + a.width >
        b.x &&

        a.y <
        b.y + b.height &&

        a.y + a.height >
        b.y

    );

}


// =====================================
// COIN COLLECTION
// =====================================

function collectCoin() {


    const dx =

        player.x +
        player.width / 2 -
        coin.x;


    const dy =

        player.y +
        player.height / 2 -
        coin.y;


    const distance =

        Math.sqrt(
            dx * dx +
            dy * dy
        );


    if (distance < 30) {


        score += 10;


        document.getElementById(
            "score"
        ).textContent = score;


        // RANDOM COIN LOCATION

        coin.x =

            Math.random() *
            (canvas.width - 60) +
            30;


        coin.y =

            Math.random() *
            (canvas.height - 60) +
            30;

    }

}


// =====================================
// ENEMY COLLISION
// =====================================

function enemyCollision() {


    if (
        rectangleCollision(
            player,
            enemy
        )
    ) {


        lives--;


        document.getElementById(
            "lives"
        ).textContent = lives;


        // RESET PLAYER

        player.x = 100;

        player.y = 235;


        // GAME OVER

        if (lives <= 0) {


            alert(
                "GAME OVER!\n\nYour score: " +
                score
            );


            resetGame();

        }

    }

}


// =====================================
// BACKGROUND
// =====================================

function drawBackground() {


    ctx.fillStyle = "#151515";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // GRID

    ctx.strokeStyle = "#242424";

    ctx.lineWidth = 1;


    for (
        let x = 0;
        x < canvas.width;
        x += 40
    ) {


        ctx.beginPath();


        ctx.moveTo(
            x,
            0
        );


        ctx.lineTo(
            x,
            canvas.height
        );


        ctx.stroke();

    }


    for (
        let y = 0;
        y < canvas.height;
        y += 40
    ) {


        ctx.beginPath();


        ctx.moveTo(
            0,
            y
        );


        ctx.lineTo(
            canvas.width,
            y
        );


        ctx.stroke();

    }

}


// =====================================
// DRAW PLAYER
// =====================================

function drawPlayer() {


    ctx.fillStyle = "#00ff88";


    ctx.fillRect(

        player.x,

        player.y,

        player.width,

        player.height

    );

}


// =====================================
// DRAW COIN
// =====================================

function drawCoin() {


    ctx.beginPath();


    ctx.arc(

        coin.x,

        coin.y,

        coin.radius,

        0,

        Math.PI * 2

    );


    ctx.fillStyle = "#ffd700";


    ctx.fill();


    ctx.closePath();

}


// =====================================
// DRAW ENEMY
// =====================================

function drawEnemy() {


    ctx.fillStyle = "#ff3b3b";


    ctx.fillRect(

        enemy.x,

        enemy.y,

        enemy.width,

        enemy.height

    );

}


// =====================================
// RESET GAME
// =====================================

function resetGame() {


    score = 0;

    lives = 3;


    document.getElementById(
        "score"
    ).textContent = score;


    document.getElementById(
        "lives"
    ).textContent = lives;


    player.x = 100;

    player.y = 235;


    coin.x = 600;

    coin.y = 200;

}


// =====================================
// RESTART BUTTON
// =====================================

document
    .getElementById("restartButton")
    .addEventListener(
        "click",
        resetGame
    );


// =====================================
// GAME LOOP
// =====================================

function gameLoop() {


    // DRAW BACKGROUND

    drawBackground();


    // UPDATE

    movePlayer();

    moveEnemy();

    collectCoin();

    enemyCollision();


    // DRAW

    drawCoin();

    drawEnemy();

    drawPlayer();


    // LOOP

    requestAnimationFrame(
        gameLoop
    );

}


// =====================================
// START GAME
// =====================================

gameLoop();
