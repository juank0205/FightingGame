var express = require("express");
const path = require('path');
var app = express();
let rooms = {};

//SETTINGS
app.set('PORT', process.env.PORT || 3000);

//STATIC FILES
app.use(express.static(path.join(__dirname, 'client')));

//START THE SERVER
const server = app.listen(app.get('PORT'), () => { 
    console.log(`Server running on port ${app.get('PORT')}`);
});

const io = require('socket.io')(server);

io.on('connection', socket => {
    socket.on("joinRoom", (username, roomName) => {
        const user = {
            username: username,
            id: socket.id,
            room: roomName
        }
        if(roomName in rooms){
            rooms[roomName].push(user);
        }else{
            rooms[roomName] = [user];
        }
        io.to(user.id).emit('joinServer', user);
    }) 

    socket.on('input', input => {
        console.log(socket.id, ': ', input.move);
    }); 
});