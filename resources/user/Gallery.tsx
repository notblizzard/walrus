import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  makeStyles,
  Theme,
  Select,
  MenuItem,
  Grid,
  Button,
  darken,
  Checkbox,
  Tooltip,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import ViewImageDialog from "../images/ViewImageDialog";
import AddAlbum from "../albums/AddAlbum";
import AddImagesToAlbum from "../albums/AddImagesToAlbum";
import DeleteImages from "../images/DeleteImages";
import DeleteAlbum from "../albums/DeleteAlbum";
import Cookies from "js-cookie";
interface Image {
  id: number;
  createdAt: string;
  updatedAt: string;
  path: string;
  thumbnailPath: string;
  private: boolean;
  title: string;
  name: boolean;
  album: Album;
}

interface Checked {
  [imageId: string]: boolean;
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
  avatarPath: string;
}

interface Album {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  images: Image[];
}

/*
enum SelectMenu {
  NewAlbum,
  AllNonAlbumImages,
  AllImages,
}
*/
const useStyles = makeStyles((theme: Theme) => ({
  image: {
    margin: theme.spacing(1),
    cursor: "pointer",
    //boxShadow: "4px 4px #1f1f20",
  },
  button: {
    backgroundColor: "#23f0c7",
    marginBottom: theme.spacing(1),
    "&:hover": {
      backgroundColor: darken("#23f0c7", 0.1),
    },
  },
  container: {
    position: "relative",
    backgroundColor: "#222",
    "&::hover": {
      // opacity: 0.4,
    },
  },
  containerImage: {
    "&:hover": {
      opacity: 0.2,
    },
  },
  buttonDelete: {
    backgroundColor: "#f13c3c",
    marginBottom: theme.spacing(1),
    "&:hover": {
      backgroundColor: darken("#f13c3c", 0.1),
    },
  },
  selectRoot: {
    borderBottomColor: "#23f0c7",

    "& ::before": {
      borderBottomColor: "#23f0c7",
    },
    "&::before": {
      borderBottomColor: "#23f0c7",
    },
    "& .MuiInputBase-root::before": {
      borderBottomColor: "#23f0c7",
    },
    //backgroundColor: "#eee",
    color: "#eee",
    margin: theme.spacing(1),
    minWidth: 120,
  },
  checkbox: {
    "& .MuiIconButton-label": {
      color: "#fe4d4d",
    },
  },
}));

const Gallery = (): JSX.Element => {
  const classes = useStyles();
  const csrf = Cookies.get("X-CSRF-TOKEN")!;
  const [select, setSelect] = useState("all-images");
  const [user, setUser] = useState<User>(null!);
  const [image, setImage] = useState<Image>(null!);
  const [open, setOpen] = useState(false);
  const [addAlbum, setAddAlbum] = useState(false);
  const [addImages, setAddImages] = useState(false);
  const [deleteImages, setDeleteImages] = useState(false);
  const [deleteAlbum, setDeleteAlbum] = useState(false);
  const [checked, setChecked] = useState<Checked>({} as Checked);
  const [toggle, setToggle] = useState(false);
  const [currentImagesInAlbum, setCurrentImagesInAlbum] = useState<number[]>(
    [],
  );

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user);
          const images = data.user.images
            .map((image: Image) => image.id.toString())
            .reduce(
              (x: { [key: string]: boolean }, y: string) => (
                (x[y] = toggle), x
              ),
              {},
            );
          setChecked(images);
        }
      });
  }, [toggle]);

  const handleDialogOpen = (e: React.MouseEvent<HTMLImageElement>): void => {
    const imageId = e.currentTarget.getAttribute("data-id");
    fetch(`/api/image/${imageId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setImage(data.image);
          setOpen(true);
        }
      });
  };

  const handleDialogClose = (e: React.MouseEvent<HTMLButtonElement>): void => {
    setOpen(false);
  };

  const handleAddImagesDialogOpen = (
    e: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    const alreadyInAlbumImageIds = user.images
      .filter((image) => Number.parseInt(select) === image.album.id)
      .map((image) => image.id);
    setCurrentImagesInAlbum(alreadyInAlbumImageIds);
    setAddImages(true);
  };

  const handleAddImagesDialogClose = (
    e: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    setAddImages(false);
  };

  const handleDeleteImagesToggle = (
    e: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    setDeleteImages(!deleteImages);
  };

  const handleDeleteAlbumOpen = (
    e: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    setDeleteAlbum(true);
  };

  const handleDeleteAlbumClose = (
    e: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    setDeleteAlbum(false);
  };

  const handleDeleteImagesDialogClose = (
    e: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    setDeleteImages(false);
  };

  const handleNewAlbumDialogClose = (
    e: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    setAddAlbum(false);
  };

  const handleSelectChange = (
    e: React.ChangeEvent<{ value: unknown }>,
  ): void => {
    const value = e.target.value as string;
    if (value === "add-album") {
      setAddAlbum(true);
    }
    setSelect(value);
  };

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const id = e.target.value;
    // !null === true
    setChecked({ ...checked, [id as string]: !checked[id as string] });
  };

  const toggleAllDelete = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const images = user.images
      .filter((image) => {
        if (select === "all-non-album-images") {
          return image.album.id === 0;
        } else if (!["all-images", "add-album"].includes(select)) {
          return Number.parseInt(select) === image.album.id;
        } else {
          return image;
        }
      })
      .map((image) => image.id.toString())
      .reduce(
        (x: { [key: string]: boolean }, y: string) => ((x[y] = !toggle), x),
        {},
      );
    setChecked(images);
    setToggle(!toggle);
  };

  const handleAlbumDelete = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const id = Number.parseInt(select);
    fetch(`/api/album/delete-album`, {
      method: "POST",
      body: JSON.stringify({ id }),
      headers: {
        "X-CSRF-Token": csrf,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser({
            ...user,
            albums: user.albums.filter((album) => album.id !== id),
          });
          setDeleteAlbum(false);
          setSelect("all-images");
        }
      });
  };

  const handleNewAlbum = (
    e: React.FormEvent<HTMLFormElement>,
    title: string,
  ): void => {
    e.preventDefault();
    fetch("/api/album/new", {
      method: "POST",
      body: JSON.stringify({ title }),
      headers: {
        "X-CSRF-Token": csrf,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser({ ...user, albums: user.albums.concat(data.album) });
        }
      });
  };

  const handleAddImagesToAlbum = (
    e: React.FormEvent<HTMLFormElement>,
    checked: Checked,
  ): void => {
    e.preventDefault();
    const images = Object.keys(checked)
      .filter((x) => checked[x])
      .map((x) => Number.parseInt(x));
    fetch(`/api/album/add-images`, {
      method: "POST",
      headers: {
        "X-CSRF-Token": csrf,
      },
      body: JSON.stringify({ imageIds: images, id: Number.parseInt(select) }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser({
            ...user,
            images: user.images.map((image) => {
              if (images.includes(image.id)) {
                image.album = { ...image.album, id: Number.parseInt(select) };
              }
              return image;
            }),
          });
          setAddImages(false);
        }
      });
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const images = Object.keys(checked)
      .filter((x) => checked[x])
      .map((x) => Number.parseInt(x));
    fetch(`/api/image/delete-images`, {
      method: "POST",
      headers: {
        "X-CSRF-Token": csrf,
      },
      body: JSON.stringify({ ids: images }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser({
            ...user,
            images: user.images.filter((image) => {
              return !data.images.includes(image.id);
            }),
          });
        }
      });
  };

  return (
    <>
      {user && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Grid container style={{ padding: "4rem" }}>
            <Grid item xs={9}>
              <AddImagesToAlbum
                open={addImages}
                onClose={handleAddImagesDialogClose}
                currentImages={currentImagesInAlbum}
                handleAddImagesToAlbum={handleAddImagesToAlbum}
              />
              <DeleteAlbum
                open={deleteAlbum}
                onClose={handleDeleteAlbumClose}
                handleAlbumDelete={handleAlbumDelete}
              />
              <AddAlbum
                open={addAlbum}
                onClose={handleNewAlbumDialogClose}
                handleNewAlbum={handleNewAlbum}
              />
              <DeleteImages
                open={false}
                onClose={handleDeleteImagesDialogClose}
              />
              <ViewImageDialog
                open={open}
                onClose={handleDialogClose}
                image={image}
              />
              <Box
                display="flex"
                flexDirection="column"
                flexWrap="wrap"
                justifyContent="center"
              >
                {deleteImages ? (
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="center"
                  >
                    <Button
                      onClick={handleDelete}
                      className={classes.buttonDelete}
                      variant="contained"
                    >
                      Delete
                    </Button>
                    <Button
                      className={classes.button}
                      variant="contained"
                      onClick={toggleAllDelete}
                    >
                      Toggle All
                    </Button>
                  </Box>
                ) : null}
                <Box display="flex" flexDirection="row" flexWrap="wrap">
                  {user.images
                    .filter((image) => {
                      if (select === "all-non-album-images") {
                        return image.album.id === 0;
                      } else if (
                        !["all-images", "add-album"].includes(select)
                      ) {
                        return Number.parseInt(select) === image.album.id;
                      } else {
                        return image;
                      }
                    })
                    .map((image: Image) => (
                      <Box
                        key={image.id}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexDirection="column"
                        className={classes.image}
                      >
                        <Tooltip
                          title={
                            <>
                              <Typography>{image.title}</Typography>
                              <Typography>{image.createdAt}</Typography>
                            </>
                          }
                        >
                          <img
                            className={classes.containerImage}
                            src={`/i/${image.thumbnailPath}/`}
                            data-id={image.id}
                            onClick={handleDialogOpen}
                          ></img>
                        </Tooltip>
                        {deleteImages ? (
                          <label>
                            <Checkbox
                              checked={checked[image.id]}
                              onChange={handleCheck}
                              data-id={image.id}
                              value={image.id}
                              classes={{ root: classes.checkbox }}
                            />
                          </label>
                        ) : null}
                      </Box>
                    ))}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box
                display="flex"
                flexDirection="column"
                style={{ width: "100%" }}
              >
                <Button
                  onClick={handleAddImagesDialogOpen}
                  variant="contained"
                  fullWidth
                  className={classes.button}
                >
                  Add To {select === "all-images" ? "Gallery" : "Album"}
                </Button>
                {!["all-images", "add-album"].includes(select) ? (
                  <>
                    <Link to={`/album/${select}`} style={{ width: "100%" }}>
                      <Button
                        variant="contained"
                        fullWidth
                        className={classes.button}
                      >
                        View Album
                      </Button>
                    </Link>
                    <Button
                      variant="contained"
                      fullWidth
                      className={classes.button}
                      onClick={handleDeleteAlbumOpen}
                    >
                      Delete Album
                    </Button>
                  </>
                ) : null}
                <Button
                  onClick={handleDeleteImagesToggle}
                  variant="contained"
                  fullWidth
                  className={classes.button}
                >
                  Delete Images
                </Button>
                <Select
                  id="demo-simple-select"
                  onChange={handleSelectChange}
                  value={select}
                  fullWidth
                  classes={{ root: classes.selectRoot }}
                >
                  <MenuItem value="all-images">All Images</MenuItem>
                  <MenuItem value="all-non-album-images">
                    All Non-Album Images
                  </MenuItem>
                  <MenuItem value="add-album">Add Album</MenuItem>
                  {user.albums.map((album) => (
                    <MenuItem key={album.id} value={album.id}>
                      {album.title}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};

export default Gallery;
