const express = require("express");
const http = require("http"); // Using http for HTTP server
const fs = require("fs");
const cors = require("cors");
const socketIO = require("socket.io");
const { join } = require("path");
const nodeDB = require("@ajayos/nodedb");

const keys = {
  key: fs.readFileSync("./chat.key"),
  cert: fs.readFileSync("./chat.crt"),
};

const db = new nodeDB(join(__dirname, "db.sql")); // SQLite database

const app = express();
const server = http.createServer(app); // HTTP server
app.use(cors());
const io = socketIO(server, {
  cors: {
    origin: "*",
  },
});

// create a new user in the database with the given name and socket id
app.post("/user", async (req, res) => {
  const { name, sid, id } = req.body;
  if (!name || !sid || !id) {
    return res.status(400).json({ error: "Invalid request" });
  }
  const joined = new Date();
  const user = await db.getDB("users", id);

  if (user) {
    await db.setDB("users", id, {
      name,
      sid,
      id,
      online: false,
      joined,
    });

    var getMessages = await db.getDB("messages", id);
    var getPublicMessages = await db.getDB("messages", "global");
    if (!getMessages) {
      getMessages = [];
      await db.setDB("messages", id, []);
    }
    if (!getPublicMessages) {
      getPublicMessages = [];
      await db.setDB("messages", "global", []);
    }

    return res.status(200).json({
      ...user,
      messages: getMessages,
      publicMessages: getPublicMessages,
    });
  } else {
    await db.setDB("users", id, {
      name,
      sid,
      id,
      online: false,
      joined,
    });
    await db.setDB("messages", id, []);
    const publicMessages = await db.getDB("messages", "global");

    return res.status(200).json({
      name,
      sid,
      id,
      online: false,
      joined,
      messages: [],
      publicMessages: publicMessages || [],
    });
  }
});

// get all users from the database
app.get("/users", async (req, res) => {
  const users = await db.getDB("users");
  return res.status(200).json(users || []);
});

// get all messages from the database
app.get("/messages", async (req, res) => {
  const messages = await db.getDB("messages", "global");
  return res.status(200).json(messages || []);
});

// get all messages for a specific user from the database
app.get("/messages/:id", async (req, res) => {
  const { id } = req.params;
  const messages = await db.getDB("messages", id);
  return res.status(200).json(messages || []);
});

// set a message for a specific user in the database
app.post("/messages/:id", async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Invalid request" });
  }
  const messages = await db.getDB("messages", id);
  if (messages) {
    await db.setDB("messages", id, [...messages, message]);
  } else {
    await db.setDB("messages", id, [message]);
  }
  return res.status(200).json({ message });
});

// set a message for all users in the database
app.post("/messages", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Invalid request" });
  }
  const messages = await db.getDB("messages", "global");
  if (messages) {
    await db.setDB("messages", "global", [...messages, message]);
  } else {
    await db.setDB("messages", "global", [message]);
  }
  return res.status(200).json({ message });
});

// delete a message for a specific user in the database
app.delete("/messages/:id", async (req, res) => {
  const { id } = req.params;
  await db.setDB("messages", id, []);
  return res.status(200).json({ message: "Messages deleted" });
});

// delete a message for all users in the database
app.delete("/messages", async (req, res) => {
  await db.setDB("messages", "global", []);
  return res.status(200).json({ message: "Messages deleted" });
});

// set the media to public folder
app.post("/media", async (req, res) => {
  const { media } = req.body;
  if (!media) {
    return res.status(400).json({ error: "Invalid request" });
  }
  const path = join(__dirname, "public", media.name);
  fs.writeFileSync(path, media.data);
  return res.status(200).json({ path });
});


// Initialize users and messages
let users = [];
let messages = [];

// Handle socket connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle joining
  socket.on("join", async (name, id) => {
    console.log(`User ${name} joined with id ${id} and socket id ${socket.id}`);

    // Check if the user already exists
    const existingUser = users.find((user) => user.id === id);

    if (existingUser) {
      // Update existing user with socket ID and set online status
      users = users.map((user) =>
        user.id === id ? { ...user, sid: socket.id, online: true } : user
      );
    } else {
      // Add new user to the users array
      users.push({
        id,
        name,
        sid: socket.id,
        joined: new Date(),
        online: true,
      });
    }

    // Emit updated users list to all clients
    io.emit("users", users);

    // Fetch messages from database for the joining user
    const userMessages = await db.getDB("messages", id);
    socket.emit("messages", userMessages || []);

    // Fetch global group messages (if any) for the joining user
    const globalMessages = await db.getDB("messages", "global");
    socket.emit("globalMessages", globalMessages || []);
  });

  // Handle global group messages
  socket.on("globalMessage", async ({ id, type, mediaPath, text, from }) => {
    const message = {
      id,
      type,
      mediaPath,
      text,
      from,
      time: new Date(),
    };

    // Store message in database under 'global' section
    await db.setDB("messages", "global", message);
    messages.push(message);

    // Broadcast message to all clients
    io.emit("globalMessage", message);
  });

  // Handle private messages
  socket.on(
    "privateMessage",
    async ({ id, type, mediaPath, text, from, to }) => {
      const message = {
        id,
        type,
        mediaPath,
        text,
        from,
        to,
        time: new Date(),
      };

      // Store message in database under 'to' user's section
      await db.setDB("messages", to, message);
      messages.push(message);

      // Emit message to sender and receiver
      socket.emit("privateMessage", message); // Emit to sender
      io.to(to.sid).emit("privateMessage", message); // Emit to receiver
    }
  );

  // Handle disconnections
  socket.on("disconnect", () => {
    const user = users.find((user) => user.sid === socket.id);
    if (user) {
      console.log(`User ${user.name} disconnected`);
      users = users.map((u) => {
        if (u.sid === socket.id) {
          return { ...u, sid: null, online: false, joined: new Date() }; // Update online status and joined time
        }
        return u;
      });
      io.emit("users", users);
    }
  });
});

// Start the server
const port = 8000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
