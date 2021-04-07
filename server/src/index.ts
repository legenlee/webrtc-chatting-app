import { Server } from "socket.io";
import { Message } from "./types";

const io = new Server({
  serveClient: false,
  cors: {
    origin: ["http://localhost:8080", "http://192.168.1.3:8080"],
  },
});

io.on("connection", (socket) => {
  console.log(`${socket.id} appeared to the void.`);

  socket.on("message", (message: Message) => {
    socket.broadcast.emit("message", message);
  });

  socket.on("create-or-join", (roomId: string) => {
    console.log(`${socket.id} discovering existence.`);

    const clientsInRoom = io.sockets.adapter.rooms.get(roomId);

    switch (clientsInRoom?.size) {
      default:
      case 0: {
        socket.join(roomId);
        socket.emit("room-created", socket.id, roomId);
        console.log(`${socket.id} created existence and named to ${roomId}.`);
        break;
      }
      case 1: {
        socket.join(roomId);
        io.sockets.in(roomId).emit("room-join");
        socket.emit("room-joined", socket.id, roomId);
        io.sockets.in(roomId).emit("room-ready");
        console.log(`${socket.id} discovered existence known as ${roomId}.`);
        break;
      }
      case 2: {
        socket.emit("room-full");
        console.log(
          `${socket.id} discovered invisible existence known as ${roomId}`
        );
        break;
      }
    }
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} disappeared out of the void.`);
  });
});

io.attach(3000, {
  pingInterval: 10000,
  pingTimeout: 5000,
});
