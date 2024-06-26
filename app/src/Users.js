import React from "react";
import { Box, List, ListItemText, Avatar, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  userBox: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    border: "1px solid white",
    borderRadius: "8px",
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    marginRight: theme.spacing(2),
    position: "relative",
  },
  onlineIndicator: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "green",
    position: "absolute",
    bottom: 0,
    right: 0,
    border: "2px solid white", // Border around the indicator to separate it from the avatar
  },
  userName: {
    display: "block",
  },
  joinTime: {
    display: "block",
    fontSize: "0.8rem",
    color: "gray",
  },
  youText: {
    color: "lightgray",
    fontStyle: "italic",
  },
}));

const Users = ({ users }) => {
  const classes = useStyles();
  const localUuid = localStorage.getItem("uuid");

  const formatJoinTime = (joinTime) => {
    const date = new Date(joinTime);
    const options = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
      timeZone: "Asia/Kolkata",
    };
    return date.toLocaleString("en-US", options);
  };

  const handleUserClick = (user) => {
    console.log(user); // Log the user info to the console
  };

  return (
    <Box>
      <List>
        {users.map((user) => (
          <Box
            key={user.id}
            className={classes.userBox}
            onClick={() => handleUserClick(user)}
          >
            <Avatar
              className={classes.avatar}
              src={`https://xsgames.co/randomusers/avatar.php?g=pixel&name=${user.name}`}
            >
              {/* {user.name} */}
              <span className={classes.onlineIndicator} />
            </Avatar>
            <ListItemText
              primary={
                <Typography
                  component="span"
                  variant="body1"
                  className={classes.userName}
                >
                  {user.name}{" "}
                  {user.id === localUuid && (
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.youText}
                    >
                      (you)
                    </Typography>
                  )}
                </Typography>
              }
              secondary={
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.joinTime}
                >
                  {formatJoinTime(user.joined)}
                </Typography>
              }
            />
          </Box>
        ))}
      </List>
    </Box>
  );
};

export default Users;
