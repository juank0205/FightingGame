import {playerNumber, enemyId, socket} from './client.js';
import Player from './Player.js';

const player1 = new Player.Sprite({ 
    position: { x: 200, y: 0 }, 
    size: { x: 50, y: 150 },
    moveSpeed: { x: 6, y: 20, fastFall: 5 }, 
    gravity: 1,
    color: 'red'
});

const player2 = new Player.Sprite({ 
    position: { x: 600, y: 0 }, 
    size: { x: 50, y: 150 },
    moveSpeed: { x: 6, y: 20, fastFall: 5 }, 
    gravity: 1,
    color: 'blue'
});

let player;
let enemy;

//Variable to track the current fps that the game is running at
const fpsDisplayer = document.getElementById('fps');

//Variables needed to calculate fps
var then, now, elapsed, fpsInterval, startTime;
var frameCount = 0;

//Storing the game canvas
const canvas = document.querySelector('canvas');
const c = canvas.getContext("2d");

//Canvas width and height
const cWidth = 1024;
const cHeight = 576;

//Setting the actual width and height from the variables created before
canvas.height = cHeight;
canvas.width = cWidth;

let keybinds = [
    {key: 'w', pressed: false}, //Move up
    {key: 's', pressed: false}, //Move down
    {key: 'a', pressed: false}, //Move left
    {key: 'd', pressed: false}, //Move right
    {key: 'p', pressed: false} //Main attack
]

function setEnemies() {
    if(playerNumber == 1){
        player = player1;
        enemy = player2;
    } else{
        player = player2;
        enemy = player1;
    }
    player.setEnemy(enemy);
    enemy.setEnemy(player);
}

function checkInput() {
    player1.resetXMovement();
    player2.resetXMovement();
    //Player 1 functions
    if (keybinds[0].pressed) sendMove(0, 1, player.jump());
    if (keybinds[1].pressed) sendMove(1, 1, player.fastFall());
    if (keybinds[2].pressed) sendMove(2, 1, player.moveLeft());
    if (keybinds[3].pressed) sendMove(3, 1, player.moveRight());
    if (keybinds[4].pressed) sendMove(4, 1), player.startAttack(0);
}

function sendMove(move, playerNumber){
    socket.to(enemyId).emit('input', move);
}

socket.on("sendMove", move => {
    switch (move){
        case 0:
            enemy.jump();
            break;
        case 1:
            enemy.fastFall();
            break;
        case 2:
            enemy.moveLeft();
            break;
        case 3:
            enemy.moveRight();
            break;
        case 0:
            enemy.startAttack(0);
            break;
    }
});

function addKeyboardListener(){
    document.addEventListener('keydown', e => {
        switch (e.key) {
            //Player inputs
            case keybinds[0].key:
                keybinds[0].pressed = true;
                break;
            case keybinds[1].key:
                keybinds[1].pressed = true;
                break;
            case keybinds[2].key:
                keybinds[2].pressed = true;
                break;
            case keybinds[3].key:
                keybinds[3].pressed = true;
                break;
            case keybinds[4].key:
                keybinds[4].pressed = true;
                break;
        }
    
        document.addEventListener('keyup', e => {
            switch (e.key) {
                //Player Inputs
                case keybinds[0].key:
                    keybinds[0].pressed = false;
                    break;
                case keybinds[1].key:
                    keybinds[1].pressed = false;
                    break;
                case keybinds[2].key:
                    keybinds[2].pressed = false;
                    break;
                case keybinds[3].key:
                    keybinds[3].pressed = false;
                    break;
                case keybinds[4].key:
                    keybinds[4].pressed = false;
                    break;
            }
        });

        //Prevent default scrolling from these keys
        if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    });
}

//Control fps to cap at the desired frame-rate
function startAnimating(fps) {
    setEnemies();
    addKeyboardListener();
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
}

//Refreshes the canvas according to the frame-rate given
function animate() {
    if (player1 == null || player2 == null) return;
    requestAnimationFrame(animate);

    now = Date.now();
    elapsed = now - then;

    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);

        c.fillStyle = 'black';
        c.fillRect(0, 0, canvas.width, canvas.height)

        checkInput();
        player.manageFrameData();
        enemy.manageFrameData();

        player.update(c);
        enemy.update(c);

        var sinceStart = now - startTime;
        var currentFps = Math.round((1000 / (sinceStart / ++frameCount)) * 100) / 100;
        fpsDisplayer.textContent = currentFps;
    }
}

export { c, cHeight, cWidth, startAnimating, keybinds};