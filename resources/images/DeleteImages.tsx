import React, { useState } from "react";
import { Box, Dialog, DialogContent, Checkbox } from "@material-ui/core";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
interface DeleteImagesProps {
  open: boolean;
  onClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

interface Image {
  id: number;
  createdAt: string;
  updatedAt: string;
  path: string;
  thumbnailPath: string;
}

interface Checked {
  [imageId: string]: boolean;
}

const DeleteImages = ({ open, onClose }: DeleteImagesProps): JSX.Element => {
  const csrf = Cookies.get("X-CSRF-TOKEN")!;
  const [images, setImages] = useState<Image[]>(null!);
  const [checked, setChecked] = useState<Checked>({} as Checked);

  const fetchChecks = (): void => {
    fetch("/api/user/images")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setImages(data.images);
        }
      });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const images = Object.keys(checked)
      .filter((x) => checked[x])
      .map((x) => Number.parseInt(x));
    fetch(`/api/image/delete-images`, {
      method: "POST",
      headers: {
        "X-CSRF-Token": csrf,
      },
      body: JSON.stringify({ ids: images }),
    });
  };

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const id = e.target.value;
    // !null === true
    setChecked({ ...checked, [id as string]: !checked[id as string] });
  };

  return (
    <Box>
      <Dialog open={open} onClose={onClose} onEntering={fetchChecks}>
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
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DeleteImages;
