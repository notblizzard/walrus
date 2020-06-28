import React from "react";
import {
  Dialog,
  DialogContent,
  makeStyles,
  Theme,
  Grid,
  Box,
  Typography,
  Button,
  darken,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import CopyToClipboard from "react-copy-to-clipboard";

interface Image {
  id: number;
  createdAt: string;
  updatedAt: string;
  path: string;
  private: boolean;
  title: string;
  name: boolean;
}

interface ViewImageDialogProps {
  open: boolean;
  image: Image;
  onClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  image: {
    padding: theme.spacing(1),
    maxHeight: "100%",
    maxWidth: "50%",
  },
  copyLink: {
    backgroundColor: "#23f0c74a",
    borderRadius: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    //paddingRight: theme.spacing(1),
  },
  downloadLink: {
    width: "100%",
  },
  downloadButton: {
    backgroundColor: "#23f0c7",
    borderRadius: theme.spacing(1, 1, 1, 1),
    marginTop: theme.spacing(1),
    "&:hover": {
      backgroundColor: darken("#23f0c7", 0.1),
    },
  },
  button: {
    backgroundColor: "#23f0c7",
    borderRadius: theme.spacing(0, 1, 1, 0),
    //marginBottom: theme.spacing(1),
    "&:hover": {
      backgroundColor: darken("#23f0c7", 0.1),
    },
  },
  text: {
    color: "#eee",
  },
  dialog: {
    backgroundColor: "#091215",
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1f1f20",
  },
  link: {
    color: "#95e1ff",
    fontSize: "0.9rem",
    textDecoration: "none",
  },
}));

const ViewImageDialog = ({
  open,
  onClose,
  image,
}: ViewImageDialogProps): JSX.Element => {
  const classes = useStyles();

  return (
    <>
      {image && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="lg"
          fullWidth
          classes={{ paper: classes.dialog }}
        >
          <DialogContent>
            <Grid container>
              <Grid item xs={8}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  className={classes.imageContainer}
                >
                  <img src={`/i/${image.path}`} className={classes.image}></img>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box display="flex" flexDirection="column">
                  <Typography className={classes.text}>Image Link</Typography>
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
                    <CopyToClipboard
                      text={`https://localhost:8000/image/${image.id}`}
                    >
                      <Button
                        className={classes.button}
                        variant="contained"
                        size="large"
                      >
                        Copy
                      </Button>
                    </CopyToClipboard>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="column">
                  <Typography className={classes.text}>Direct Link</Typography>
                  <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    className={classes.copyLink}
                  >
                    <Typography className={classes.link}>
                      {" "}
                      <Link to={`/image/${image.id}`} className={classes.link}>
                        https://localhost:8000/i/{image.path}
                      </Link>
                    </Typography>
                    <CopyToClipboard
                      text={`https://localhost:8000/i/${image.path}`}
                    >
                      <Button
                        className={classes.button}
                        variant="contained"
                        size="large"
                      >
                        Copy
                      </Button>
                    </CopyToClipboard>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="row">
                  <a
                    href={`/i/${image.path}`}
                    className={classes.downloadLink}
                    download
                  >
                    <Button
                      variant="contained"
                      fullWidth
                      className={classes.downloadButton}
                    >
                      Download
                    </Button>
                  </a>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ViewImageDialog;
