import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  makeStyles,
  Theme,
  Grid,
  darken,
  Typography,
  Switch,
  TextField,
  fade,
} from "@material-ui/core";
import { Link, useParams } from "react-router-dom";
import ViewFullImage from "../images/ViewFullImage";
import CopyToClipboard from "react-copy-to-clipboard";
import Cookies from "js-cookie";

interface Image {
  id: number;
  createdAt: string;
  updatedAt: string;
  path: string;
  thumbnailPath: string;
  description: string;
}
interface User {
  id: number;
  createdAt: string;
  updatedAt: string;
  email: string;
  githubId: string;
  username: string;
  images: Image[];
  albums: Album[];
}

interface Album {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  private: boolean;
  images: Image[];
}

interface Checked {
  [imageId: string]: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  imageContainer: {
    width: "100%",
    //height: "50%",
    backgroundColor: "#1f1f20",
  },
  copyLink: {
    backgroundColor: "#23f0c74a",
    borderRadius: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    //paddingRight: theme.spacing(1),
  },
  link: {
    color: "#95e1ff",
    textDecoration: "none",
  },
  text: {
    color: "#eee",
  },
  image: {
    padding: theme.spacing(1),
    maxHeight: "100%",
    maxWidth: "80%",
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
    //marginBottom: theme.spacing(1),
    "&:hover": {
      backgroundColor: darken("#23f0c7", 0.1),
    },
  },
  switchTrack: {
    backgroundColor: "#23f0c7",
  },
  grid: {
    padding: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  switchBase: {
    "& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb": {
      color: "#23f0c7",
    },

    "& .MuiSwitch-colorSecondary.Mui-checked + .MuiSwitch-track": {
      backgroundColor: "#23f0c7",
    },
    /*
    "& .MuiSwitch-track + .Mui-checked": {
      backgroundColor: "#23f0c7 !important",
    },
    "&. MuiMuiSwitch-track + .Mui-checked": {
      backgroundColor: "#23f0c7",
    },
    // color: "#23f0c7",*/
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
}));

const ViewAlbum = (): JSX.Element => {
  const csrf = Cookies.get("X-CSRF-TOKEN")!;
  const classes = useStyles();
  const [openViewFullImage, setOpenViewFullImage] = useState(false);
  const [openViewFullImageUrl, setOpenViewFullImageUrl] = useState("");
  const { albumId } = useParams();
  const [album, setAlbum] = useState<Album>(null!);
  const [typing, setTyping] = useState<NodeJS.Timeout | number>(null!);

  useEffect(() => {
    fetch(`/api/album/${albumId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAlbum(data.album);
        }
      });
  }, [albumId]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const title = e.target.value;
    setAlbum({ ...album, title });
    clearTimeout(typing as NodeJS.Timeout);
    setTyping(
      setTimeout(() => {
        fetch(`/api/album/update`, {
          method: "POST",
          headers: {
            "X-CSRF-Token": csrf,
          },
          body: JSON.stringify({ ...album, title }),
        });
      }, 2000),
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const name = e.target.getAttribute("name") as string;
    const id = e.currentTarget.getAttribute("data-id") as string;
    const value = e.target.value;
    const image = album.images.filter(
      (image) => image.id === Number.parseInt(id),
    )[0];
    const images = album.images.map((image) => {
      if (image.id === Number.parseInt(id)) {
        image.description = value;
      }
      return image;
    });
    setAlbum({ ...album, images });
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

  const handleSwitch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setAlbum({ ...album, private: e.target.checked });
    fetch(`/api/album/update`, {
      method: "POST",
      headers: {
        "X-CSRF-Token": csrf,
      },
      body: JSON.stringify({
        title: album.title,
        private: e.target.checked,
        id: album.id,
      }),
    });
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

  return (
    <>
      {album && (
        <>
          <ViewFullImage
            open={openViewFullImage}
            onClose={setViewFullImageClose}
            imageUrl={openViewFullImageUrl}
          />
          <Grid container>
            <TextField
              name="title"
              id="standard-basic"
              label="Title"
              fullWidth
              onChange={handleTitleChange}
              value={album.title}
              classes={{
                root: classes.input,
              }}
            />
            <Grid item xs={8}>
              {album.images.map((image: Image) => (
                <Box
                  key={image.id}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                  className={classes.imageContainer}
                >
                  <img
                    //ref={imageRef}
                    onClick={setViewFullImageOpen}
                    src={`/i/${image.path}`}
                    className={classes.image}
                  ></img>
                  <TextField
                    inputProps={{ "data-id": image.id }}
                    name="description"
                    id="standard-basic"
                    label="Description"
                    fullWidth
                    multiline
                    rows="4"
                    onChange={handleImageChange}
                    value={image.description}
                    classes={{
                      root: classes.input,
                    }}
                  />
                </Box>
              ))}
            </Grid>
            <Grid item xs={4} className={classes.grid}>
              <Box
                display="flex"
                flexDirection="column"
                position="fixed"
                style={{ width: "32%" }}
              >
                <Typography className={classes.text}>
                  {album.private ? "Private" : "Public"}
                </Typography>
                <Switch
                  checked={album.private}
                  name="private"
                  onChange={handleSwitch}
                  classes={{
                    root: classes.switchBase,
                    track: classes.switchTrack,
                  }}
                />
                <Typography className={classes.text}>Album Link</Typography>
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  className={classes.copyLink}
                >
                  <Typography className={classes.link}>
                    <Link to={`/image/${album.id}`} className={classes.link}>
                      https://localhost:8000/album/{album.id}
                    </Link>
                  </Typography>
                  <CopyToClipboard
                    text={`https://localhost:8000/album/${album.id}`}
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
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default ViewAlbum;
