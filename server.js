const express=require("express");
const app=express();
const server = require('http').Server(app);
const io=require('socket.io')(server)
const {v4: uuidv4}=require('uuid');
const {ExpressPeerServer}=require('peer');
const peerServer=ExpressPeerServer(server,{
    debug:true
});


app.use('/peerjs',peerServer);
app.use(express.static('public'));
app.set('view engine','ejs');

app.get('/',(req,res)=>{
    //this directs us to the room with a specific link
    res.redirect(`/${uuidv4()}`);
})
app.get('/:room',(req,res)=>{
    res.render('room',{roomId:req.params.room})
})

//this tells about the connection when the user is connected
io.on('connection',socket=>{
    socket.on('join-room',(roomId,userId)=>{
        //joining the room using the id
        socket.join(roomId);
        //this tells us that a user has been connected
        socket.to(roomId).emit('user-connected',userId);
    })
})






server.listen(process.env.PORT || 3000);