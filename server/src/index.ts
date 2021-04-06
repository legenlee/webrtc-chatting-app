import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {});

io.on("connection", () => {
  //
});

httpServer.listen(3000);
