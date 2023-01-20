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
    keybinds[actionSelected-1].key = key;
}

function waitingKeyPress(){
    return new Promise((resolve) => {
        document.addEventListener('keydown', e =>{
            resolve (e.key);
        });
    })    
}

addButtonListeners();