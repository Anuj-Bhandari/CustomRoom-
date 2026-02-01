import {WebSocketServer , WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

let userCount = 0 ;
let allSockets: WebSocket[] = [] ; // websocket type 

  wss.on('connection', (socket) => {
    allSockets.push(socket);

    userCount++;

    console.log(`user connected ${userCount}`);

    socket.on('message', (message) => {
    console.log( "message received " + message.toString())
      
 for (let i = 0; i < allSockets.length; i++) {
  const s : any = allSockets[i];
  s.send(message.toString() + " sent by the server");
}

    })
  });

    
  
