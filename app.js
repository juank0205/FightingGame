var express = require("express");
const path = require('path');
var app = express();
let rooms = {};
let users = [];

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
    socket.emit("connected", socket.id);
    socket.on("createRoom", socketUser => {
        if (socketUser.username.length == 0) return io.to(socket.id).emit('createRoom', 0);
        if(socketUser.roomName in rooms){
            return io.to(socket.id).emit('createRoom', 0);
        }else{
            const user = {
                username: socketUser.username,
                id: socket.id,
                room: socketUser.roomName
            }
            users[socket.id] = user;
            rooms[socketUser.roomName] = [user];
            socket.join(socketUser.roomName);
            return io.to(user.id).emit('createRoom', 1);
        }
    });
    
    socket.on("joinRoom", socketUser => {
        if (socketUser.username == '') return io.to(socket.id).emit('joinRoom', 0);
        if (!(rooms.hasOwnProperty(socketUser.roomName))){
            return io.to(socket.id).emit('joinRoom', 1);
        } else if(rooms[socketUser.roomName].length == 2){
            return io.to(socket.id).emit('joinRoom', 2);
        } else{
            const user = {
                username: socketUser.username,
                id: socket.id,
                room: socketUser.roomName
            }
            users[socket.id] = user;
            rooms[socketUser.roomName].push(user);
            socket.join(socketUser.roomName);
            console.log(rooms);
            return io.in(socketUser.roomName).emit('joinRoom', {code: 3,  room:rooms[socketUser.roomName]});
        }
    });
    
    socket.on("sendMove", input => io.to(input.enemy).emit("sendMove", { x: input.x, y: input.y}));  
    socket.on("sendAttack", input => io.to(input.enemy).emit("sendAttack", input.attack));  

    socket.on('disconnect', () => {
        if (!(socket.id in users)) return;
        rooms[users[socket.id].room] = rooms[users[socket.id].room].filter( user => user.id != socket.id );
        if (rooms[users[socket.id].room].length == 0) delete rooms[users[socket.id].room];
    })
});
