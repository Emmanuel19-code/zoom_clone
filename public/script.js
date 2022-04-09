

const socket=io('/')
//getting the video
const videoGrid=document.getElementById('video_grid');
console.log(videoGrid);
//creating a video element
const myVideo=document.createElement('video');
//muting the video so it does not play back to the user
myVideo.muted=true;


var peer=new Peer(undefined,{
    path:'/peerjs',
    host:'/',
    //changing the port to 443
    port:'443'
})

//it helps us get media upload from chrome
let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
    /*we specify true because we want to get access to the video 
     and false if we dont want to get access to the video
    */
}).then(stream=>{
    myVideoStream=stream;
    addVideoStream(myVideo,stream);

    // answering the call and adding a video stream from the other party
    peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        })
    })

     //listening to the user connected
    socket.on('user-connected', (userId) => {
        connectToNewUSer(userId, stream);
    })

   
})


peer.on('open', id=>{
    //the id is a specific id for the one connecting
    //joining the room
    //this means this person has joined this id
    socket.emit('join-room',ROOM_ID,id);
})





const connectToNewUSer=(userId, stream)=>{
   const call=peer.call(userId,stream)
   const video=document.createElement('video');
   call.on('stream',userVideoStream=>{
       addVideoStream(video,userVideoStream)
   })
}


const addVideoStream=(video,stream)=>{
    /*this means we are going to take a video
      and play it that is the stream
    */
   video.srcObject=stream;
   //add taking all the data we will play the video
   video.addEventListener('loadedmetadata',()=>{
       video.play();
   })
   videoGrid.append(video)
}


//the mute button
const muteUnmute=()=>{
    console.log(myVideoStream)
   const enabled=myVideoStream.getAudioTracks()[0].enabled;
   if(enabled){
       myVideoStream.getAudioTracks()[0].enabled=false;
       setUnmuteButton();
   }else{
       setMuteButton();
       myVideoStream.getAudioTracks()[0].enabled =true;
   }
}