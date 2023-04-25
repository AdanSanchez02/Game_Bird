const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext("2d");
const gameContainer = document.getElementById('game-container');

const dogImg = new Image();
dogImg.src = 'resources/Dogi.png';

//Game constants
const dog_speed = -4;
const dog_width = 40;
const dog_height = 30;
const pipe_width = 50;
const pipe_gap = 125;

//Dogi variables
let dogX = 40;
let dogY = 50;
let dogVel =0;
let dogAcc = 0.15;

//Pipe variables
let pipeX = 400;
let pipeY = canvas.height -200;

//Score variables
let scoreDiv =  document.getElementById('score-display');
let score = 0;
let highScore = 0;

// bool for chech when dog passes we increase
let scored = false;

//control the dog with the space key
document.body.onkeyup = function(e){
    if(e.code == 'Space'){
        dogVel = dog_speed;
    }
}

// restart the game with button
document.getElementById('restart-button').addEventListener('click', function() {
    hideEndMenu();
    resetGame();
    loop();
})

function increaseScore(){
    //icrease now our scounter when our dog passes the pipes
    if (dogX > pipeX + pipe_width &&
        (dogY < pipeY + pipe_gap || 
            dogY + dog_height > dogY + pipe_gap) &&
            !scored){
                score++;
                scoreDiv.innerHTML = score;
                scored = true;
            }

    if (dogX < pipeX + pipe_width){
        scored = false;
    }
}

function collisionCheck(){
    //pipe box
    const dogBox={
        x: dogX,
        y: dogY,
        width: dog_width,
        height: dog_height
    }

    const topPipeBox = {
        x: pipeX,
        y: pipeY - pipe_gap + dog_height,
        width: pipe_width,
        height: pipeY
    }

    const botPipeBox = {
        x: pipeX,
        y: pipeY + pipe_gap + dog_height,
        width: pipe_width,
        height: canvas.height - pipeY - pipe_gap
    }

    //check for collision with pipe box upper
    if (dogBox.x + dogBox.width > topPipeBox.x && 
        dogBox.x < topPipeBox.x + topPipeBox.width &&
        dogBox.y < topPipeBox.y){
            return true;
    }

    //check for collision with pipe box lower
    if (dogBox.x + dogBox.width > botPipeBox.x && 
        dogBox.x < botPipeBox.x + botPipeBox.width &&
        dogBox.y + dogBox.height > botPipeBox.y){
            return true;
    }

    //check if dogi his boundaries
    if (dogY < 0 || dogY + dog_height > canvas.height){
        return true;
    }

    return false;
}

function hideEndMenu(){
    document.getElementById('end-menu').style.display = 'none';
    gameContainer.classList.remove('backdrop-blur');

}

function showEndMenu(){
    document.getElementById('end-menu').style.display = 'block';
    gameContainer.classList.add('backdrop-blur');
    document.getElementById('end-score').innerHTML = score;
    // our highscore 
    if(highScore < score){
        highScore =  score;
    }
    document.getElementById('best-score').innerHTML = highScore;
} 

// reset game and the values
function resetGame(){
    dogX = 40;
    dogY = 50;
    dogVel =0;
    dogAcc = 0.15;

    pipeX = 400;
    pipeY = canvas.height -200;

    score = 0;
}

function endGame(){
    //alert('error en la matrix');
    showEndMenu();
}

function loop(){
    // reset ctx after loop iteration
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Dogi
    ctx.drawImage(dogImg, dogX, dogY);

    //Draw Pipes
    ctx.fillStyle = '#333';
    ctx.fillRect(pipeX, -100, pipe_width, pipeY);
    ctx.fillRect(pipeX, pipeY + pipe_gap, pipe_width, canvas.height - pipeY);

    // collision check and end game
    if(collisionCheck()){
        endGame();
        return;
    }

    //Move the pipes
    pipeX -= 1.5;
    //pipe move out the frame reste pipe
    if(pipeX < -50){
        pipeX = 400;
        pipeY = Math.random() * (canvas.height - pipe_gap) + pipe_width;
    }

    //Move dog gravity
    dogVel += dogAcc;
    dogY += dogVel;

    // call increase score
    increaseScore();
    requestAnimationFrame(loop);
}

loop();