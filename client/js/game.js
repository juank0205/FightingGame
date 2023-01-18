const room = getQueryParameter("room") || getRandomString(5);
window.history.replaceState({}, document.title, updateQueryParameter('room', room));
const socket = io();

//Import player classes
import Player from './Player.js'
import { getQueryParameter, getRandomString, updateQueryParameter } from './utils.js';

//Variable to track the current fps that the game is running at
const fpsDisplayer = document.getElementById('fps');

//Variables needed to calculate fps
var then, now, elapsed, fpsInterval, startTime;
var frameCount = 0;

//Storing the game canvas
const canvas = document.querySelector('canvas');
const c = canvas.getContext("2d");

//Login component
const form = document.querySelector('#formLogin');
const roomInput = document.querySelector('#room');
let userName = ''; 
document.querySelector('#showRoom').textContent = room;

form.addEventListener('submit', e =>{
    e.preventDefault();
    userName = e.target.elements.username.value;
    console.log(userName);
    document.querySelector('#showName').textContent = userName;
    userName = e.target.elements.username.value = '';
    userName = e.target.elements.username.focus();
});

//Canvas width and height
const cWidth = 1024;
const cHeight = 576;

//Setting the actual width and height from the variables created before
canvas.height = cHeight;
canvas.width = cWidth;

socket.emit("joinServer");
socket.emit("joinRoom", room);


socket.on("playerJoined", () => {
    console.log('player joined');
});

//Creting two instances of Player class, representing player one and player two
const player1 = new Player.Sprite({ 
    playerNumber: 1,
    position: { x: 200, y: 0 }, 
    size: { x: 50, y: 150 },
    moveSpeed: { x: 6, y: 20, fastFall: 5 }, 
    gravity: 1,
    color: 'red',
    healthBar: document.getElementById('health-player-1')
});

const player2 = new Player.Sprite({ 
    playerNumber: 2,
    position: { x: 600, y: 0 },
    size: { x: 50, y: 150 },
    moveSpeed: { x: 6, y: 20, fastFall: 5 }, 
    gravity: 1,
    color: 'blue',
    healthBar: document.getElementById('health-player-2')
});

setPlayer2Input();
setEnemies();

function setPlayer2Input() {
    player2.keybinds = [
        { key: 'ArrowUp', pressed: false }, //Move up
        { key: 'ArrowDown', pressed: false }, //Move down
        { key: 'ArrowLeft', pressed: false }, //Move left
        { key: 'ArrowRight', pressed: false }, //Move right
        { key: '1', pressed: false } //Move right
    ]
}

function setEnemies() {
    player1.setEnemy(player2);
    player2.setEnemy(player1);
}

//Control fps to cap at the desired frame-rate
function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
}

//Refreshes the canvas according to the frame-rate given
function animate() {
    requestAnimationFrame(animate);

    now = Date.now();
    elapsed = now - then;

    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);

        c.fillStyle = 'black';
        c.fillRect(0, 0, canvas.width, canvas.height)

        checkInput();
        player1.manageFrameData();
        player2.manageFrameData();

        player1.update(c);
        player2.update(c);

        var sinceStart = now - startTime;
        var currentFps = Math.round((1000 / (sinceStart / ++frameCount)) * 100) / 100;
        fpsDisplayer.textContent = currentFps;
    }
}

function checkInput() {
    player1.resetXMovement();
    player2.resetXMovement();
    //Player 1 functions
    if (player1.keybinds[0].pressed) sendMove(0, 1);
    if (player1.keybinds[1].pressed) sendMove(1, 1);
    if (player1.keybinds[2].pressed) sendMove(2, 1);
    if (player1.keybinds[3].pressed) sendMove(3, 1);
    if (player1.keybinds[4].pressed) sendMove(4, 1);
    
    //Player 2 functions
    if (player2.keybinds[0].pressed) player2.jump();
    if (player2.keybinds[1].pressed) player2.fastFall();
    if (player2.keybinds[2].pressed) player2.moveLeft();
    if (player2.keybinds[3].pressed) player2.moveRight();
    if (player2.keybinds[4].pressed) player2.startAttack(0);
}

function sendMove(move, playerNumber){
    socket.emit('input', {
        playerNumber: playerNumber,
        move: move
    });
}

document.addEventListener('keydown', e => {
    switch (e.key) {
        //Player 1 inputs
        case player1.keybinds[0].key:
            player1.keybinds[0].pressed = true;
            break;
        case player1.keybinds[1].key:
            player1.keybinds[1].pressed = true;
            break;
        case player1.keybinds[2].key:
            player1.keybinds[2].pressed = true;
            break;
        case player1.keybinds[3].key:
            player1.keybinds[3].pressed = true;
            break;
        case player1.keybinds[4].key:
            player1.keybinds[4].pressed = true;
            break;

        //Player 2 inputs
        case player2.keybinds[0].key:
            player2.keybinds[0].pressed = true;
            break;
        case player2.keybinds[1].key:
            player2.keybinds[1].pressed = true;
            break;
        case player2.keybinds[2].key:
            player2.keybinds[2].pressed = true;
            break;
        case player2.keybinds[3].key:
            player2.keybinds[3].pressed = true;
            break;
        case player2.keybinds[4].key:
            player2.keybinds[4].pressed = true;
            break;
    }

    //Prevent default scrolling from these keys
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
});

document.addEventListener('keyup', e => {
    switch (e.key) {
        //Player 1 Inputs
        case player1.keybinds[0].key:
            player1.keybinds[0].pressed = false;
            break;
        case player1.keybinds[1].key:
            player1.keybinds[1].pressed = false;
            break;
        case player1.keybinds[2].key:
            player1.keybinds[2].pressed = false;
            break;
        case player1.keybinds[3].key:
            player1.keybinds[3].pressed = false;
            break;
        case player1.keybinds[4].key:
            player1.keybinds[4].pressed = false;
            break;

        //Player 2 Inputs
        case player2.keybinds[0].key:
            player2.keybinds[0].pressed = false;
            break;
        case player2.keybinds[1].key:
            player2.keybinds[1].pressed = false;
            break;
        case player2.keybinds[2].key:
            player2.keybinds[2].pressed = false;
            break;
        case player2.keybinds[3].key:
            player2.keybinds[3].pressed = false;
            break;
        case player2.keybinds[4].key:
            player2.keybinds[4].pressed = false;
            break;
    }
});

startAnimating(60);


export { c, cHeight, cWidth, player1, player2 };