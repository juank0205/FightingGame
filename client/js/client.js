let room = getQueryParameter("room") || getRandomString(5);
window.history.replaceState({}, document.title, updateQueryParameter('room', room));
const socket = io();
let id = '';
let enemyId = null;

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
const createBtn = document.getElementById('createBtn');
const joinBtn = document.getElementById('joinBtn');
const buttons = document.getElementById('room-buttons');
const feedback = document.getElementById('room-feedback');
const error = document.getElementById('errorFeedback');

let userName = ''; 
document.querySelector('#showRoom').textContent = room;

formLogin.addEventListener('submit', e =>{
    e.preventDefault();
    userName = e.target.elements.username.value;
    room = e.target.elements.room.value;
    document.querySelector('#showName').textContent = userName;
    document.querySelector('#showRoom').textContent = room;
    e.target.elements.username.focus();
    e.target.elements.room.focus();
});

createBtn.addEventListener('click', e => {
    e.preventDefault();
    socket.emit('createRoom', {
        username: userName,
        roomName: room
    });
});

joinBtn.addEventListener('click', e =>{
    e.preventDefault();
    socket.emit('joinRoom', {
        username: userName,
        roomName: room
    })
});


socket.on("createRoom", response => {
    if (response == 0) return error.textContent = 'Type a username';
    if(response == 1) console.log('Room created');
    error.textContent = '';
    buttons.classList.toggle('hide');
    formLogin.classList.toggle('hide');
    feedback.classList.toggle('hide');
});

socket.on("joinRoom", response => {
    console.log(response.code);
    if (response.code == 0) return error.textContent = 'Type a valid username';
    if(response.code == 1) return error.textContent = 'Room does not exist';
    if(response.code == 2) return error.textContent = 'Room full';
    if(response.code == 3) {
        console.log('Room Joined');
        for(let i=0; i<response.room.length; i++){
            if (response.room[i].id == id){
                playerNumber = i+1;
            } else{
                enemyId = response.room[i].id;
            }
        }
        error.textContent = '';
        document.getElementById('gameManager').classList.toggle('hide');
        document.getElementById('control-1').classList.toggle('hide');
        document.getElementById('roomManager').classList.toggle('hide');
        startAnimating(60);
    }
});

export { playerNumber, socket, enemyId };