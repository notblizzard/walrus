import { Link } from "react-router-dom";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Checkbox,
  Button,
} from "@material-ui/core";

interface Checked {
  [imageId: string]: boolean;
}

interface Image {
  id: number;
  createdAt: string;
  updatedAt: string;
  path: string;
  thumbnailPath: string;
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
  images: Image[];
}

interface AddImagesToAlbumProps {
  open: boolean;
  onClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
  currentImages: number[];
  handleAddImagesToAlbum: (
    e: React.FormEvent<HTMLFormElement>,
    checked: Checked,
  ) => void;
}

const AddImagesToAlbum = ({
  open,
  onClose,
  currentImages,
  handleAddImagesToAlbum,
}: AddImagesToAlbumProps): JSX.Element => {
  const [images, setImages] = useState<Image[]>(null!);
  const [checked, setChecked] = useState<Checked>({} as Checked);

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const id = e.target.value;
    // !null === true
    setChecked({ ...checked, [id as string]: !checked[id as string] });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    handleAddImagesToAlbum(e, checked);
  };

  const fetchChecks = (): void => {
    fetch("/api/user/images")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setImages(data.images);
          const keys = data.images
            .map((image: Image) => image.id)
            //.filter((id: number) => currentImages.includes(id))
            .reduce(
              (x: { [key: string]: boolean }, y: string) => (
                (x[y] = currentImages.includes(Number.parseInt(y))), x
              ),
              {},
            );
          setChecked({ ...keys });
        }
      });
  };

  return (
    <Dialog
      open={open}
      onEntering={fetchChecks}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
    >
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="row" flexWrap="wrap">
            {images &&
              images.map((image: Image) => (
                <Box
                  key={image.id}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Link to={`/image/${image.id}/`}>
                    <img src={`/i/${image.thumbnailPath}/`}></img>
                  </Link>
                  <Checkbox
                    checked={checked[image.id]}
                    onChange={handleCheck}
                    data-id={image.id}
                    value={image.id}
                  />
                </Box>
              ))}
          </Box>
          <Button type="submit">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddImagesToAlbum;
