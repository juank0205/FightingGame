import { keybinds } from "./game.js";

const keybindsNumber = keybinds.length;

function addButtonListeners(){
    for (let i=0; i<keybindsNumber; i++){
        const button = document.getElementById('control-1').querySelector('.movement-' + (i+1));
        button.addEventListener('click', ()=>{
            button.textContent = 'Press a key';
            clickHandler(button, i+1);
        });
    }
}

async function clickHandler(button, actionSelected){
    let key = await waitingKeyPress();
    button.textContent = key;
    switch (playerNumber){
        case 1:
            keybinds[actionSelected-1].key = key;
            player1.setKeybinds(actionSelected-1, key);
            break;
        case 2:
            player2.setKeybinds(actionSelected-1, key);
            break;
    }
}

function waitingKeyPress(){
    return new Promise((resolve) => {
        document.addEventListener('keydown', e =>{
            resolve (e.key);
        });
    })    
}

addButtonListeners();