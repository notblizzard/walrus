import React from "react";
import {
  Box,
  Button,
  Typography,
  makeStyles,
  Theme,
  darken,
} from "@material-ui/core";
import CopyToClipboard from "react-copy-to-clipboard";
import { Link } from "react-router-dom";
interface Image {
  id: number;
  path: string;
}

interface ImageOverlayProps {
  image: Image;
  setCropImageDialogOpen: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  imageOverlayButtons: {
    opacity: 0,
    position: "absolute",
    top: "60%",
    right: "40%",
    margin: theme.spacing(1),
    //position: "absolute",
  },
  button: {
    backgroundColor: "#23f0c7",
    //marginBottom: theme.spacing(1),
    "&:hover": {
      backgroundColor: darken("#23f0c7", 0.1),
    },
  },
  overlayButton: {
    backgroundColor: "#23f0c7",
    borderRadius: theme.spacing(0, 1, 1, 0),

    //marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(1),
    "&:hover": {
      backgroundColor: darken("#23f0c7", 0.1),
    },
  },
  copyLink: {
    backgroundColor: "#23f0c74a",
    borderRadius: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
  link: {
    color: "#95e1ff",
    textDecoration: "none",
  },
}));
const ImageOverlay = ({
  image,
  setCropImageDialogOpen,
}: ImageOverlayProps): JSX.Element => {
  const classes = useStyles();
  return (
    <Box
      className={classes.imageOverlayButtons}
      display="flex"
      flexDirection="column"
    >
      <Button
        onClick={setCropImageDialogOpen}
        variant="contained"
        className={classes.button}
        size="small"
      >
        Use as Avatar
      </Button>
      <Box display="flex" flexDirection="column">
        <Typography variant="caption">Image Link</Typography>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          className={classes.copyLink}
        >
          <Typography className={classes.link}>
            <Link to={`/image/${image.id}`} className={classes.link}>
              https://localhost:8000/image/{image.id}
            </Link>
          </Typography>
          <CopyToClipboard text={`https://localhost:8000/image/${image.id}`}>
            <Button
              className={classes.overlayButton}
              variant="contained"
              size="small"
            >
              Copy
            </Button>
          </CopyToClipboard>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column">
        <Typography variant="caption">Direct Link</Typography>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          className={classes.copyLink}
        >
          <Typography className={classes.link}>
            <Link to={`/image/${image.id}`} className={classes.link}>
              https://localhost:8000/i/{image.path}
            </Link>
          </Typography>
          <CopyToClipboard text={`https://localhost:8000/i/${image.path}`}>
            <Button
              className={classes.overlayButton}
              variant="contained"
              size="small"
            >
              Copy
            </Button>
          </CopyToClipboard>
        </Box>
      </Box>
    </Box>
  );
};

export default ImageOverlay;
