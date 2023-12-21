const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const { sendMessage } = require("./messages/send");
const cors = require("cors"); // Import the cors middleware

const ChatApi = require("./services/chat/index");
const AuthApi = require("./services/auth/index");
const MessageApi = require("./services/messages/index");
const UserApi = require("./services/user/index");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const mongoURI =
  "mongodb+srv://root:geras2004.@cluster0.p7ntirq.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoURI);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use(express.json());
app.use(cors());
app.use("/chat", ChatApi);
app.use("/auth", AuthApi);
app.use("/message", MessageApi);
app.use("/user", UserApi);

app.post("/", (req, res) => {
  res.status(200).send("Hello, World!");
});

io.on("connection", (socket) => {
  console.log("A client is connected");

  socket.on("joinChannel", (channelName) => {
    socket.join(channelName);
  });

  socket.on("sendMessage", async (channelName, message) => {
    const { data } = await sendMessage(message);
    io.to(channelName).emit("messageRecive", data);
  });

  socket.on("userTyping", async (nickname, chatId) => {
    console.log("this case is working ====", nickname, chatId);
    const data = { nickname, chatId };
    io.to(chatId).emit("userTypingRecive", data);
  });

  socket.on("deleteMessage", async (channelName, id) => {
    io.to(channelName).emit("reciveDeletedMessageId", id);
  });

  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});

const port = 8000;

server.listen(port, () => {
  console.log(`Express app with WebSocket is running on port ${port}`);
});
