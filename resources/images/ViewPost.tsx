import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  makeStyles,
  Theme,
  Card,
  CardContent,
  fade,
  IconButton,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import {
  FavoriteBorder as NotLikedIcon,
  Favorite as LikedIcon,
} from "@material-ui/icons";
import Moment from "../util/Moment";
import Avatar from "../util/Avatar";
import Cookies from "js-cookie";

interface Image {
  id: number;
  createdAt: string;
  updatedAt: string;
  path: string;
  thumbnailPath: string;
  user: User;
  comments: Comment[];
  private: boolean;
}

interface Comment {
  id: number;
  createdAt: string;
  updatedAt: string;
  data: string;
  user: User;
  image: Image;
}
interface User {
  id: number;
  createdAt: string;
  updatedAt: string;
  email: string;
  githubId: string;
  username: string;
  avatarPath: string;
}

interface Post {
  comments: Comment[];
  images: Image[];
}

const useStyles = makeStyles((theme: Theme) => ({
  form: {
    width: "80%",
  },
  input: {
    color: "#eee",
    // margin: theme.spacing(2),

    "& .MuiFormLabel-root": {
      color: "#eee",
    },

    "& .MuiOutlinedInput-root": {
      color: "#eee",
      backgroundColor: fade("#66d0f9", 0.1),
      borderRadius: theme.shape.borderRadius,
      "&.Mui-focused fieldset": {
        borderColor: "#09a6f4",
        color: "#eee",
      },
    },
    "&:focus": {
      borderColor: "#eee",
    },
  },
  comment: {
    color: "#eee",
    backgroundColor: "#1f1f20",
    margin: theme.spacing(1),
    width: "80%",
  },
  like: {
    color: "#ef3333",
  },
  imageContainer: {
    width: "80%",
    height: "100%",
    backgroundColor: "#1f1f20",
  },
  image: {
    padding: theme.spacing(1),
    maxHeight: "100%",
    maxWidth: "50%",
  },
}));

const ViewPost = (): JSX.Element => {
  const csrf = Cookies.get("X-CSRF-TOKEN")!;
  const classes = useStyles();
  const [comment, setComment] = useState("");
  const [post, setPost] = useState<Post>(null!);
  const [liked, setLiked] = useState(false);
  const { postId } = useParams();

  useEffect(() => {
    fetch(`/api/post/${postId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPost(data.post);
        }
      });
  }, [postId]);

  const toggleLike = (e: React.MouseEvent<HTMLButtonElement>): void => {
    fetch("/api/like", {
      method: "POST",
      body: JSON.stringify({ postId: Number.parseInt(postId) }),
      headers: {
        "X-CSRF-Token": csrf,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLiked(data.liked);
        }
      });
  };

  const handleCommentChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setComment(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    fetch("/api/comment/new", {
      method: "POST",
      body: JSON.stringify({ data: comment, postId: Number.parseInt(postId) }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPost({ ...post, comments: post.comments.concat(data.comment) });
          //setImage({ ...image, comments: image.comments.concat(data.comment) });
        }
      });
  };

  return (
    <>
      {post && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            className={classes.imageContainer}
          >
            {post.images.map((image) => (
              <img
                key={image.id}
                src={`/i/${image.path}`}
                className={classes.image}
              ></img>
            ))}
            <IconButton onClick={toggleLike} className={classes.like}>
              {liked ? <LikedIcon /> : <NotLikedIcon />}
            </IconButton>
          </Box>
          {post.comments.map((comment) => (
            <Card key={comment.id} className={classes.comment}>
              <CardContent>
                <Grid container>
                  <Grid item xs={2}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Avatar path={comment.user.avatarPath} size={8} />
                      <Typography variant="h6">
                        {comment.user.username}
                      </Typography>
                      <Moment time={comment.createdAt} relative />
                    </Box>
                  </Grid>
                  <Grid item xs={10}>
                    <Typography>{comment.data}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
          <form onSubmit={handleSubmit} className={classes.form}>
            <TextField
              name="comment"
              id="outlined-basic"
              label="Comment"
              value={comment}
              onChange={handleCommentChange}
              multiline
              rows="4"
              fullWidth
              variant="outlined"
              classes={{ root: classes.input }}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Box>
      )}
    </>
  );
};

export default ViewPost;
