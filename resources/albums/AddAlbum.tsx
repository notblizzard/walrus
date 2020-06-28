import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  Box,
  makeStyles,
  Theme,
  fade,
  Button,
} from "@material-ui/core";

interface AddAlbumProps {
  open: boolean;
  onClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleNewAlbum: (e: React.FormEvent<HTMLFormElement>, title: string) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  input: {
    margin: theme.spacing(1),
    // width: "40%",
    "& .MuiFormLabel-root": {
      color: "#222",
    },
    "& .MuiOutlinedInput-root": {
      color: "#222",
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
const AddAlbum = ({
  open,
  onClose,
  handleNewAlbum,
}: AddAlbumProps): JSX.Element => {
  const [title, setTitle] = useState("");
  const classes = useStyles();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    handleNewAlbum(e, title);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Box>
            <TextField
              name="title"
              id="outlined-basic"
              label="Title"
              multiline
              fullWidth
              onChange={handleTitleChange}
              value={title}
              variant="outlined"
              classes={{
                root: classes.input,
              }}
            />
            <Button type="submit">Submit</Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAlbum;
