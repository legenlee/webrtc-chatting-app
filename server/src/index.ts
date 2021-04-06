import { createServer } from "http";
import { Server } from "socket.io";

import room from "./socket/room";

const httpServer = createServer();
const io = new Server(httpServer, {});

io.on("connection", (socket) => {
  socket.on("room", room);
});

httpServer.listen(3000);
