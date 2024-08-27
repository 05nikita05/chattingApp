const express = require('express');
const app = express();
const path = require("path");


const http = require('http');
const server = http.createServer(app);
const socketIo = require('socket.io');
const io = socketIo(server);
const {v4:uuidv4}=require('uuid');

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));


app.get('/',function(req,res){
    res.render('index');
})

let users=[];
let waiting=[];
let room;
io.on("connection",function(socket){
    socket.on("new user",function(newuser){
        const user = {id:socket.id,newuser}
        users.push(user);

        io.emit('user-list',users);
    })

    socket.on('joinRoom',function(newuser){
        socket.data.user = {id:socket.id,newuser}
        waiting.push(socket.data.user);
        if(waiting.length>1){
            room = uuidv4();
            waiting.forEach((userSocket) => {
                userSocket.join(room);
            });
        }
        waiting = [];
        io.to(room).emit('startChat', room);

    })

    socket.on('typing', (username) => {
        socket.broadcast.emit('typing', username);
    });

    socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing');
    });

    socket.on("chat message",function(chatMessage){
        const user = users.find(user => user.id === socket.id)|| socket.data.user;
        io.emit('chat message', {
            userId: socket.id,
            username: user ? user.newuser : 'Anonymous', 
            message: chatMessage
        }); 
    })

    socket.on("disconnect", function() {
        users = users.filter(user => user.id !== socket.id);
        io.emit('user-list', users);
        waiting = waiting.filter(userSocket => userSocket.id !== socket.id);

    });
})

server.listen(3000);