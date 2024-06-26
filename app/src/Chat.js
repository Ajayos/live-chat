import React, { useState } from "react";
import { Box, Avatar, Typography, IconButton, Menu, MenuItem, TextField, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    chatContainer: {
        display: "flex",
        flexDirection: "column",
        // alignItems: "flex-start",
        marginBottom: theme.spacing(2),
        color: theme.palette.text.primary,
    },
    chatHeader: {
        display: "flex",
        alignItems: "center",
        marginBottom: theme.spacing(2),
    },
    chatContent: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "300px",
        overflowY: "auto",
        border: "1px solid red",
        borderRadius: "8px",
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    messageWrapper: {
        display: "flex",
        marginBottom: theme.spacing(1),
        alignItems: "flex-start",
    },
    userAvatar: {
        marginRight: theme.spacing(1),
    },
    messageAvatar: {
        marginLeft: theme.spacing(1),
    },
    messageText: {
        padding: theme.spacing(1),
        borderRadius: "8px",
        backgroundColor: theme.palette.background.paper,
        maxWidth: "90%",
        width: "fit-content",
        color: theme.palette.text.primary,
    },
    controlBox: {
        display: "flex",
        alignItems: "center",
        // height: "30px",
        width: "100%",
    },
    fileUpload: {
        display: "none",
    },
    sendButton: {
        marginLeft: theme.spacing(1),
    },
}));

const Chat = () => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [message, setMessage] = useState("");
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleSend = () => {
        // Code to send message and file to backend using axios
        console.log("Sending message:", message);
        console.log("Sending file:", file);
        // Reset message and file state after sending
        setMessage("");
        setFile(null);
    };

    const openMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    return (
        <Box className={classes.chatContainer} display="flex" justifyContent="center" alignItems="center">
            <Box className={classes.chatHeader}>
                <Avatar className={classes.userAvatar} />
                <Box>
                    <Typography variant="subtitle1">User Name</Typography>
                    <Typography variant="body2" color="textSecondary">
                        Online | Last seen: Today, 10:30 AM
                    </Typography>
                </Box>
            </Box>
            <Box className={classes.chatContent}>
                <Box className={classes.messageWrapper}>
                    <Avatar className={classes.messageAvatar} />
                    <Typography className={classes.messageText}>Hello!</Typography>
                </Box>
                <Box className={classes.messageWrapper} style={{ flexDirection: "row-reverse" }}>
                    <Avatar className={classes.messageAvatar} />
                    <Typography className={classes.messageText}>Hi there!</Typography>
                </Box>
                {/* Add more messages as needed */}
            </Box>
            <Box className={classes.controlBox}>
                <IconButton onClick={openMenu}>
                    <AttachFileIcon />
                </IconButton>
                <IconButton>
                    <InsertEmoticonIcon />
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
                    <MenuItem>
                        <input
                            accept="image/*"
                            className={classes.fileUpload}
                            id="upload-image"
                            type="file"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="upload-image">Upload Image</label>
                    </MenuItem>
                    <MenuItem onClick={closeMenu}>Upload Document</MenuItem>
                </Menu>
                <TextField
                    variant="outlined"
                    placeholder="Type your message..."
                    fullWidth
                    multiline
                    rows={1}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <IconButton className={classes.sendButton} onClick={handleSend}>
                                <SendIcon />
                            </IconButton>
                        ),
                    }}
                />
            </Box>
        </Box>
    );
};

export default Chat;
