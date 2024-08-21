const express = require('express');
const app = express();
const path = require("path");


const http = require('http');
const server = http.createServer(app);
const socketIo = require('socket.io');
const io = socketIo(server);

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));


app.get('/',function(req,res){
    res.render('index');
})

let users=[];
io.on("connection",function(socket){
    socket.on("new user",function(newuser){
        const user = {id:socket.id,newuser}
        users.push(user);

        io.emit('user-list',users);

        
        // io.emit('user joined', { id: socket.id, username: username });

    })

    socket.on('typing', (username) => {
        console.log(username)
        socket.broadcast.emit('typing', username);
    });

    socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing');
    });

    socket.on("chat message",function(chatMessage){

        
    
    
        const user = users.find(user => user.id === socket.id);


        io.emit('chat message', {
            userId: socket.id,
            username: user ? user.newuser : 'Anonymous', // Fallback in case user not found
            message: chatMessage
        });
    })

    socket.on("disconnect", function() {
        // Remove the user from the list when they disconnect
        users = users.filter(user => user.id !== socket.id);

        // Emit the updated user list to all connected clients
        io.emit('user-list', users);
    });

    // socket.on("chat message",function(msg){
    //   console.log(msg);
    //   io.emit('chat message',msg);
        
    // })
})


server.listen(3000);