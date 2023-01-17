import { player1, player2 } from "./game.js";

const keybindsNumber = player1.keybinds.length;

function addButtonListeners(){
    for (let i=0; i<keybindsNumber*2; i++){
        const button = document.getElementById('control-' + Math.ceil((i+1)/keybindsNumber)).querySelector('.movement-' + ((i%(keybindsNumber))+1));
        button.addEventListener('click', ()=>{
            button.textContent = 'Press a key';
            clickHandler(button, Math.ceil((i+1)/keybindsNumber), (i%keybindsNumber)+1);
        });
    }
}

async function clickHandler(button, player, actionSelected){
    let key = await waitingKeyPress();
    button.textContent = key;
    switch (player){
        case 1:
            player1.setKeybinds(actionSelected-1, key);
            break;
        case 2:
            player2.setKeybinds(actionSelected-1, key);
            break;
    }
}

function waitingKeyPress(){
    return new Promise((resolve) => {
        document.addEventListener('keydown', (e) =>{
            resolve (e.key);
        });
    })    
}

addButtonListeners();