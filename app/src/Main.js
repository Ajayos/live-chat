import React, { useRef } from "react";
import { Grid, Box } from "@mui/material";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

import AppBar from "./AppBar";
import Users from "./Users";
import Chat from "./Chat";

const Main = ({ name }) => {
  const socketRef = useRef();
  const [messages, setMessages] = React.useState([
    {
      id: 1,
      name: "Admin",
      content: "Welcome to the chat!",
      time: new Date().toLocaleTimeString(),
    },
  ]);
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (!storedName) {
      localStorage.setItem("name", name);
    }

    const isOld = localStorage.getItem("uuid");
    if (!isOld) {
      localStorage.setItem("uuid", uuidv4());
    }

    const socket = io("http://localhost:8000");
    socketRef.current = socket;
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    const id = localStorage.getItem("uuid");
    socket.emit("join", name, id);

    socket.on("messages", (msgs) => {
      setMessages(msgs);
    });

    socket.on("users", (users) => {
      setUsers(users);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box className="main-page">
          <AppBar userName={name} />
        </Box>
      </Grid>
      <Grid item xs={12} sx={{ flexGrow: 1 }}>
        <Grid container spacing={1} sx={{ height: "100%" }}>
          <Grid item xs={12} sm={4} sx={{ height: "100%" }}>
            <Box
              sx={{
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                borderRadius: "8px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                margin: "0 8px",
              }}
            >
              <Users users={users} />
            </Box>
          </Grid>
          <Grid item xs={12} sm={8} sx={{ height: "100%" }}>
            <Box
              sx={{
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                borderRadius: "8px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                margin: "0 8px",
              }}
            >
              <Chat messages={messages} />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Main;
