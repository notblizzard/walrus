import React from "react";
import {
  DialogActions,
  Dialog,
  DialogContent,
  Button,
} from "@material-ui/core";

interface DeleteAlbumProps {
  open: boolean;
  onClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleAlbumDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
const DeleteAlbum = ({
  open,
  onClose,
  handleAlbumDelete,
}: DeleteAlbumProps): JSX.Element => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>Delete?</DialogContent>
      <DialogActions>
        <Button onClick={handleAlbumDelete}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAlbum;
