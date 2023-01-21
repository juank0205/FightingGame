import { playerNumber, socket, enemyId } from './client.js';
import Player from './Player.js';

const player1 = new Player.Sprite({
    position: { x: 200, y: 0 },
    size: { x: 50, y: 150 },
    moveSpeed: { x: 6, y: 20, fastFall: 5 },
    gravity: 1,
    color: 'red',
    healthBar: document.getElementById('health-player-2')
});

const player2 = new Player.Sprite({
    position: { x: 600, y: 0 },
    size: { x: 50, y: 150 },
    moveSpeed: { x: 6, y: 20, fastFall: 5 },
    gravity: 1,
    color: 'blue',
    healthBar: document.getElementById('health-player-1')
});

let player;
let enemy;
const playerHolder = [player, enemy];

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
    { key: 'w', pressed: false }, //Move up
    { key: 's', pressed: false }, //Move down
    { key: 'a', pressed: false }, //Move left
    { key: 'd', pressed: false }, //Move right
    { key: 'p', pressed: false } //Main attack
]

function setEnemies() {
    if (playerNumber == 1) {
        player = player1;
        enemy = player2;
    } else {
        player = player2;
        enemy = player1;
    }
    player.setEnemy(enemy);
    enemy.setEnemy(player);
}

function checkInput() {
    player.resetXMovement();
    //Player 1 functions
    if (keybinds[0].pressed) player.jump();
    if (keybinds[1].pressed) player.fastFall();
    if (keybinds[2].pressed) player.moveLeft();
    if (keybinds[3].pressed) player.moveRight();
    if (keybinds[4].pressed && player.getCanAttack()) player.startAttack(0);
}

socket.on("sendMove", move => {
    enemy.setPosition(move.x, move.y);
});

socket.on("sendAttack", attack => enemy.startAttack(attack));

function addKeyboardListener() {
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
                if (player.getCanAttack() == true){
                    keybinds[4].pressed = true;
                    socket.emit('sendAttack', {number: playerNumber, enemy: enemyId, attack: 0});
                }
                break;
        }

        //Prevent default scrolling from these keys
        if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault();
        }

    });

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
                player.setCanAttack(true);
                keybinds[4].pressed = false;
                break;
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
    socket.emit('sendMove', { x: player.getPosition().x, y: player.getPosition().y, number: playerNumber, enemy: enemyId });


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

export { c, cHeight, cWidth, startAnimating, keybinds };