import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  room: string;
}

let allSockets: User[] = [];

wss.on("connection", (socket: WebSocket) => {
  socket.on("message", (message) => {
    const parsedMessage = JSON.parse(message.toString());

    if (parsedMessage.type === "join") {
      allSockets.push({
        socket,
        room: parsedMessage.payload.roomId,
      });
    }

    if (parsedMessage.type === "chat") {
      let currentRoom: string | null = null;

      for (const user of allSockets) {
        if (user.socket === socket) {
          currentRoom = user.room;
          break;
        }
      }

      if (!currentRoom) return;

      for (const user of allSockets) {
        if (user.room === currentRoom) {
          user.socket.send(parsedMessage.payload.message);
        }
      }
    }
  });

  socket.on("close", () => {
    allSockets = allSockets.filter((u) => u.socket !== socket);
  });
});
