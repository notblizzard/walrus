import React from "react";
import {
  makeStyles,
  Theme,
  Dialog,
  Box,
  DialogContent,
  Typography,
} from "@material-ui/core";
import { PhotoLibrary as PhotoIcon } from "@material-ui/icons";
import Dropzone from "react-dropzone";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";

interface UploadProps {
  open: boolean;
  onClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
  setUpload: React.Dispatch<React.SetStateAction<boolean>>;
}

const useStyles = makeStyles((theme: Theme) => ({
  dialog: {
    height: "50%",
    padding: theme.spacing(2),
    width: "100%",
    backgroundColor: "#091215",
    //border: "2px dashed #4dadddb0", //"2px dotted red",
  },
  dialogContent: {
    paddingTop: 0,
  },
  upload: {
    color: "#eee",
    height: "100%",
    width: "100%",
    border: "2px dashed #4dadddb0", //"2px dotted red",
    //backgroundColor: "#091215",
  },
}));

const Upload = ({ open, onClose, setUpload }: UploadProps): JSX.Element => {
  const classes = useStyles();
  const history = useHistory();
  const csrf = Cookies.get("X-CSRF-TOKEN")!;

  const handleUpload = <T extends File>(acceptedFiles: T[]): void => {
    const form = new FormData();
    acceptedFiles.forEach((file) => {
      form.append("images[]", file);
    });
    fetch("/api/upload", {
      method: "POST",
      body: form,
      headers: {
        "X-CSRF-Token": csrf,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.images.length === 1) {
            history.push(`/image/${data.images[0].id}`);
          } else {
            history.push(`/album/${data.album.id}`);
          }
          setUpload(false);
        }
      });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      classes={{ paper: classes.dialog }}
      //TransitionComponent={Transition}
    >
      <DialogContent className={classes.dialogContent}>
        <Dropzone onDrop={handleUpload} noClick multiple accept={["image/*"]}>
          {({ getRootProps, getInputProps }) => (
            <Box
              {...getRootProps()}
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              className={classes.upload}
            >
              <input {...getInputProps()}></input>
              <Typography variant="h4">Drag n Drop Your Images Here</Typography>
              <PhotoIcon fontSize="large" />
            </Box>
          )}
        </Dropzone>
      </DialogContent>
    </Dialog>
  );
};

export default Upload;
