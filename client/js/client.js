let room = getQueryParameter("room") || getRandomString(5);
window.history.replaceState({}, document.title, updateQueryParameter('room', room));
const socket = io();
let id = '';

id = null;
let playerNumber = null;

socket.on("connected", socketId => {
    id = socketId;
});

//Import player classes
import {startAnimating} from './game.js';
import { getQueryParameter, getRandomString, updateQueryParameter } from './utils.js';


//Login component
const formLogin = document.getElementById('formLogin');
const formRoom = document.getElementById('formRoom');
const createBtn = document.getElementById('createBtn');
const joinBtn = document.getElementById('joinBtn');

let userName = ''; 
document.querySelector('#showRoom').textContent = room;

formLogin.addEventListener('submit', e =>{
    e.preventDefault();
    userName = e.target.elements.username.value;
    document.querySelector('#showName').textContent = userName;
    e.target.elements.username.value = '';
    e.target.elements.username.focus();
});

createBtn.addEventListener('click', e => {
    e.preventDefault();
    socket.emit('createRoom', {
        username: userName,
        roomName: room
    });
});

formRoom.addEventListener('submit', e =>{
    e.preventDefault();
    room = e.target.elements.room.value;
    console.log(room);
    document.querySelector('#showRoom').textContent = room;
    e.target.elements.room.value = '';
    e.target.elements.room.focus();
});

joinBtn.addEventListener('click', e =>{
    e.preventDefault();
    socket.emit('joinRoom', {
        username: userName,
        roomName: room
    })
});


socket.on("createRoom", response => {
    if (response == 0) return console.log('Error');
    if(response == 1) console.log('Room created');
});

socket.on("joinRoom", response => {
    if (response.code == 0) return console.log('Error');
    if(response.code == 1) return console.log('Room does not exist');
    if(response.code == 2) return console.log('Room full');
    if(response.code == 3) console.log('Room Joined');
    for(let i=0; i<response.room.length; i++){
        if (response.room[i].id == id){
            playerNumber = i+1;
        }
    }
    document.getElementById('gameManager').classList.toggle('hide');
    document.getElementById('control-1').classList.toggle('hide');
    document.getElementById('roomManager').classList.toggle('hide');
    startAnimating(60);
});

export { playerNumber, room, socket };