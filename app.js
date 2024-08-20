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

let userids=[];
let username=[];
io.on("connection",function(socket){
    socket.on("user",function(user){
        userids.push(socket.id);
        username.push(user);
        // io.emit('user',user);
    })
    socket.on("chat message",function(chatMessage){
    
    io.emit('chat message',{userId:socket.id,username:username[userids.indexOf(socket.id)],message:chatMessage});
    })

    // socket.on("chat message",function(msg){
    //   console.log(msg);
    //   io.emit('chat message',msg);
        
    // })
})


server.listen(3000);