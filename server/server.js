import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js"; // move your entire app setup into app.js

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("send-message", (data) => {
    const { roomId } = data;
    io.to(roomId).emit("receive-message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(process.env.PORT || 4000, () => {
  console.log(
    `Server is running on http://localhost:${process.env.PORT || 4000}`
  );
});

export default server;
export { io };
