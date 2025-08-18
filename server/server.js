import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js"; // move your entire app setup into app.js
import { toggleOnlineStatus } from "./controllers/userController.js";
import { notifyParticipants } from "./controllers/chatController.js";
import { startVendorToggleCron } from "./cron/toggleVendorStatus.js";
import { getBalance } from "./controllers/paystackController.js";
import { trainModel } from "./bots/nlp/train.js";

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", ({ roomId, userId }) => {
    socket.join(roomId);
    socket.data.userId = userId;
    toggleOnlineStatus(userId, true);
  });

  socket.on("send-message", (data) => {
    const { roomId } = data;
    io.to(roomId).emit("receive-message", data);
    notifyParticipants(roomId, data.message.senderId, data.message.senderName);
  });

  socket.on("typing", ({ chatId, userId, name }) => {
    io.to(chatId).emit("typing", { userId, name });
  });

  socket.on("stop-typing", ({ chatId, userId }) => {
    io.to(chatId).emit("stop-typing", { userId });
  });

  socket.on("disconnect", () => {
    const userId = socket.data.userId;
    if (userId) {
      toggleOnlineStatus(userId, false);
    }
    console.log("User disconnected:", socket.id);
  });
});

server.listen(process.env.PORT || 4000, () => {
  console.log(
    `Server is running on http://localhost:${process.env.PORT || 4000}`
  );
});

startVendorToggleCron();
getBalance();
trainModel();

export default server;
export { io };
