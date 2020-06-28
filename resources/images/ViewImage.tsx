import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  makeStyles,
  Theme,
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  fade,
  darken,
} from "@material-ui/core";
import Cookies from "js-cookie";
import "react-image-crop/dist/ReactCrop.css";
import CropImage from "./CropImage";
import ViewFullImage from "./ViewFullImage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ImageOverlay from "../util/ImageOverlay";

interface Image {
  id: number;
  createdAt: string;
  updatedAt: string;
  path: string;
  private: boolean;
  title: string;
  name: boolean;
  description: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  imageContainer: {
    width: "100%",
    backgroundColor: "#1f1f20",
  },
  input: {
    margin: theme.spacing(1),
    color: "#eee",
    "& .MuiFormLabel-root": {
      color: "#eee",
    },
    "& .MuiInputBase-root": {
      fontSize: "2rem",
      borderRadius: 0,
      color: "#eee",
    },
    "& .MuiInputBase-root ::hover": {
      borderBottom: `2px solid ${fade("#66d0f9", 0.5)}`,
    },
    "& ::before": {
      borderBottom: `2px solid ${fade("#66d0f9", 0.1)}`,
    },
    "& ::after": {
      borderBottom: "2px solid #66d0f9",
    },
    "& .MuiOutlinedInput-root": {
      color: "#eee",
      backgroundColor: fade("#66d0f9", 0.1),
      borderRadius: theme.shape.borderRadius,

      "&.Mui-focused fieldset": {
        borderColor: "#114B5F",
      },
    },
    "& .MuiFormHelperText-root": {
      fontWeight: "bold",
    },
    "&:focus": {
      borderColor: "#eee",
    },
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
  grid: {
    padding: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  image: {
    padding: theme.spacing(1),
    maxHeight: "100%",
    maxWidth: "80%",
    /* "&:hover": {
      opacity: 0.5,
    },
    "&:hover + $imageOverlayButtons": {
      opacity: `1 !important`,
    },*/
  },
  imageOverlay: {
    display: "contents",
    padding: theme.spacing(1),
    maxHeight: "100%",
    maxWidth: "80%",
    "&:hover > *": {
      opacity: 1,
    },
    "&:hover $image": {
      opacity: 0.5,
    },
  },
  imageOverlayButtons: {
    opacity: 0,
    position: "absolute",
    top: "60%",
    right: "40%",
    margin: theme.spacing(1),
    //position: "absolute",
  },
  link: {
    color: "#95e1ff",
    textDecoration: "none",
  },
  text: {
    color: "#eee",
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
    //marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(1),
    "&:hover": {
      backgroundColor: darken("#23f0c7", 0.1),
    },
  },
  switchTrack: {
    backgroundColor: "#23f0c7",
  },
  switchBase: {
    "& .MuiSwitch-switchBase": {
      color: "#23f0c7",
    },
    "& .MuiSwitch-track": {
      backgroundColor: "#23f0c7 !important",
    },
    "&.MuiSwitch-track": {
      backgroundColor: "#23f0c7",
    },
    color: "#23f0c7",
    "&$checked": {
      color: "#23f0c7",
    },
    "&$checked + $track": {
      backgroundColor: "#23f0c7",
    },
  },
  errorToastify: {
    backgroundColor: "#891414",
    color: "#eee",
  },
  successToastify: {
    backgroundColor: "#4f7c54",
    color: "#eee",
  },
}));

const ViewImage = (): JSX.Element => {
  const imageRef = useRef<HTMLImageElement>(null!);
  const [image, setImage] = useState<Image>(null!);
  const classes = useStyles();
  const { imageId } = useParams();
  const csrf = Cookies.get("X-CSRF-TOKEN")!;
  const [openViewFullImage, setOpenViewFullImage] = useState(false);
  const [openViewFullImageUrl, setOpenViewFullImageUrl] = useState("");
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState<NodeJS.Timeout | number>(null!);

  useEffect(() => {
    fetch(`/api/image/${imageId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setImage(data.image);
        }
      });
  }, [imageId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const name = e.target.getAttribute("name") as string;
    const value = e.target.value;
    setImage({ ...image, [name]: value });
    clearTimeout(typing as NodeJS.Timeout);
    setTyping(
      setTimeout(() => {
        fetch(`/api/image/update`, {
          method: "POST",
          headers: {
            "X-CSRF-Token": csrf,
          },
          body: JSON.stringify({ ...image, [name]: value }),
        });
      }, 2000),
    );
  };

  const setCropImageDialogOpen = (
    e: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    setOpen(true);
  };

  const setCropImageDialogClose = (
    e: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    setOpen(false);
  };

  const setViewFullImageOpen = (
    e: React.MouseEvent<HTMLImageElement>,
  ): void => {
    const url = e.currentTarget.getAttribute("src")!;
    setOpenViewFullImageUrl(url);
    setOpenViewFullImage(true);
  };

  const setViewFullImageClose = (
    e: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    setOpenViewFullImage(false);
  };

  const makePost = (e: React.MouseEvent<HTMLButtonElement>): void => {
    if (image.title === "") {
      toast("Title must not be blank before making post public", {
        position: "bottom-right",
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: false,
        className: classes.errorToastify,
        // bodyClassName: classes.errorToastify,
      });
      return;
    }
    fetch("/api/post/image/new", {
      method: "POST",
      body: JSON.stringify({
        type: "image",
        id: image.id,
      }),
      headers: {
        "X-CSRF-Token": csrf,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast("Post created!", {
            position: "bottom-right",
            hideProgressBar: true,
            pauseOnHover: true,
            draggable: false,
            className: classes.successToastify,
            //bodyClassName: classes.successToastify,
          });
        }
      });
  };

  return (
    <>
      {image && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <CropImage
            open={open}
            onClose={setCropImageDialogClose}
            url={`/i/${image.path}`}
            imageRef={imageRef.current}
          />
          <ViewFullImage
            open={openViewFullImage}
            onClose={setViewFullImageClose}
            imageUrl={openViewFullImageUrl}
          />
          <TextField
            name="title"
            id="standard-basic"
            label="Title"
            fullWidth
            onChange={handleImageChange}
            value={image.title}
            classes={{
              root: classes.input,
            }}
          />
          <Grid container>
            <Grid item xs={8}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                className={classes.imageContainer}
              >
                <Box className={classes.imageOverlay}>
                  <img
                    onClick={setViewFullImageOpen}
                    ref={imageRef}
                    src={`/i/${image.path}`}
                    className={classes.image}
                  ></img>
                  <ImageOverlay
                    image={image}
                    setCropImageDialogOpen={setCropImageDialogOpen}
                  />
                </Box>
                <TextField
                  name="description"
                  id="outlined-basic"
                  label="Description"
                  multiline
                  fullWidth
                  onChange={handleImageChange}
                  value={image.description}
                  variant="outlined"
                  rows="4"
                  classes={{
                    root: classes.input,
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={4} className={classes.grid}>
              <Box display="flex" flexDirection="column">
                <Typography className={classes.text}>
                  {image.private ? "Private" : "Public"}
                </Typography>
                <Button
                  onClick={makePost}
                  variant="contained"
                  className={classes.button}
                >
                  Make Post
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};

export default ViewImage;
