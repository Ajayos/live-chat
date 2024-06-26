import React from "react";
import { AppBar, Toolbar, Typography, Avatar, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "rgba(0, 0, 0, 0.1)", // Transparent background
  },
  grow: {
    flexGrow: 1,
  },
  avatar: {
    marginLeft: theme.spacing(2),
  },
  userName: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
  },
  rainbowText: {
    display: "flex",
    alignItems: "center",
  },
  red: {
    color: "red",
  },
  orange: {
    color: "orange",
  },
  yellow: {
    color: "yellow",
  },
  green: {
    color: "green",
  },
  blue: {
    color: "blue",
  },
  indigo: {
    color: "indigo",
  },
  violet: {
    color: "violet",
  },
}));

const AppBarComponent = ({ userName }) => {
  const classes = useStyles();

  const renderRainbowText = (text) => {
    const colors = [
      classes.red,
      classes.orange,
      classes.yellow,
      classes.green,
      classes.blue,
      classes.indigo,
      classes.violet,
    ];
    return text.split("").map((char, index) => (
      <span key={index} className={colors[index % colors.length]}>
        {char + " "}
      </span>
    ));
  };

  const handleAvatarClick = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <Box className={classes.grow} />
        <Typography variant="h6" className={classes.userName}>
          <span className={classes.rainbowText}>
            {renderRainbowText(userName)}
          </span>
        </Typography>
        <Avatar
          className={classes.avatar}
          alt={userName}
          src={userName}
          onClick={handleAvatarClick}
        />
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
