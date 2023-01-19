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
    socket.on("createRoom", socketUser => {
        if (socketUser.username == undefined) return io.to(socket.id).emit('createRoom', 0);
        if(socketUser.roomName in rooms){
            return io.to(socket.id).emit('createRoom', 0);
        }else{
            const user = {
                username: socketUser.username,
                id: socket.id,
                room: socketUser.roomName
            }
            rooms[socketUser.roomName] = [user];
            console.log(rooms);
            socket.join(socketUser.roomName);
            return io.to(user.id).emit('createRoom', 1);
        }
    }) 

    // socket.on('input', input => {
    //     console.log(socket.id, ': ', input.move);
    // }); 
});