const express = require('express');
const http    = require('http');
const path    = require('path');

const app     = express();
const server  = http.createServer(app);

const socketio = require('socket.io'); 
const io       = socketio(server); 

const { generateMessage,generateLocationMessage }  = require('./utils/messages');

const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, '../public'))); 

io.on('connection',(socket)=>{
    console.log('Socket Server !!!');

    socket.emit('message',generateMessage("Welcome User"));
    socket.broadcast.emit('message',generateMessage("A new user has joined"));

    socket.on('sendMessage',(message,callback)=>{
        io.emit('message',generateMessage(message));
        callback();
        // socket.on('disconnect',()=>{
        //     io.emit('message',"A user has left the room");
        // })
    })

    socket.on('sendLocation',(coords,callback)=>{
        io.emit('locationMessage',generateLocationMessage("https://google.com/maps?q="+coords.latitude+","+coords.longitude));
        callback();
    })
})

server.listen(port,()=>{
    console.log("Server is running on port:"+port);
})