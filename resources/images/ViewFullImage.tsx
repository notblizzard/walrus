import React from "react";
import { Dialog, makeStyles, Theme, Box } from "@material-ui/core";

interface ViewFullImageProps {
  imageUrl: string;
  open: boolean;
  onClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  imageContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
  dialog: {
    backgroundColor: "transparent",
  },
}));

const ViewFullImage = ({
  imageUrl,
  open,
  onClose,
}: ViewFullImageProps): JSX.Element => {
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      classes={{ paperFullScreen: classes.dialog }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        className={classes.imageContainer}
        onClick={onClose}
      >
        <img src={imageUrl}></img>
      </Box>
    </Dialog>
  );
};

export default ViewFullImage;
