import React, { useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./Home";
import Register from "./auth/Register";
import Login from "./auth/Login";
import ViewPost from "./images/ViewPost";
import { makeStyles, Theme, Box } from "@material-ui/core";
import Navbar from "./Navbar";
import Gallery from "./user/Gallery";
import ViewAlbum from "./albums/ViewAlbum";
import Upload from "./Upload";
import Settings from "./user/Settings";
import ViewImage from "./images/ViewImage";
import { ToastContainer } from "react-toastify";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    backgroundColor: "#131314", //"#080b17",
    color: "#dff0f7",
    minHeight: `calc(100% - ${theme.spacing(10)}px)`,
    paddingTop: theme.spacing(10),
  },
  dropzone: {
    height: "100%",
    width: "100%",
  },
}));

const App = (): JSX.Element => {
  const classes = useStyles();
  const [upload, setUpload] = useState(false);

  const handleUploadDialogOpen = (e: React.DragEvent<HTMLElement>): void => {
    setUpload(true);
  };

  const handleUploadDialogClose = (
    e: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    setUpload(false);
  };

  const handleUploadDialogDragLeave = (
    e: React.DragEvent<HTMLElement>,
  ): void => {
    setUpload(false);
  };

  return (
    <Box
      className={classes.container}
      onDragEnter={handleUploadDialogOpen}
      onDragExit={handleUploadDialogDragLeave}
    >
      <BrowserRouter>
        <Navbar />
        <Upload
          open={upload}
          onClose={handleUploadDialogClose}
          setUpload={setUpload}
        />
        <ToastContainer />
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/gallery" component={Gallery} />
          <Route path="/register" component={Register} />
          <Route path="/post/:postId" component={ViewPost} />
          <Route path="/image/:imageId" component={ViewImage} />
          <Route path="/album/:albumId" component={ViewAlbum} />
          <Route path="/settings" component={Settings} />

          <Route path="/" component={Home} />
        </Switch>
      </BrowserRouter>
    </Box>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
