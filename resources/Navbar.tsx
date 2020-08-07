import React from "react";
import { useHistory, Link } from "react-router-dom";
import {
  Toolbar,
  makeStyles,
  Theme,
  AppBar,
  Box,
  IconButton,
} from "@material-ui/core";
import Cookies from "js-cookie";
import {
  ExitToApp as ExitToAppIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
} from "@material-ui/icons";
import Avatar from "./util/Avatar";

const useStyles = makeStyles((theme: Theme) => ({
  navBar: {
    backgroundColor: "#1f1f22",
    // boxShadow: "none",
    marginBottom: theme.spacing(4),
  },
  toolBar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  icon: {
    color: "#eee",
  },
}));

const Navbar = (): JSX.Element => {
  const history = useHistory();
  const classes = useStyles();

  const handleLogout = (): void => {
    fetch("/api/logout").then(() => {
      Cookies.remove("avatar");
      history.push("/");
    });
  };

  return (
    <AppBar className={classes.navBar} position="fixed">
      <Toolbar className={classes.toolBar}>
        {Cookies.get("avatar") ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="row-reverse"
          >
            <Link to="/gallery">
              <Avatar path={Cookies.get("avatar")!} size={5} />
            </Link>
            <IconButton
              title="Logout"
              className={classes.icon}
              onClick={handleLogout}
            >
              <ExitToAppIcon fontSize="large" />
            </IconButton>
            <Link to="/settings">
              <IconButton title="Settings" className={classes.icon}>
                <SettingsIcon />
              </IconButton>
            </Link>
          </Box>
        ) : (
          <Box display="flex" flexDirection="row-reverse">
            <Link to="/login">
              <IconButton title="Login" className={classes.icon}>
                <ExitToAppIcon fontSize="large" />
              </IconButton>
            </Link>
          </Box>
        )}
        <IconButton title="Home" className={classes.icon}>
          <HomeIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
