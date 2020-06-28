import React, { useEffect, useState } from "react";
import { Typography, Box, Button, Paper } from "@material-ui/core";
import { Link } from "react-router-dom";

interface Image {
  id: number;
  createdAt: string;
  updatedAt: string;
  path: string;
  thumbnailPath: string;
  postId: number;
}

interface Post {
  id: number;
  title: string;
  images: Image[];
}

const Home = (): JSX.Element => {
  const [posts, setPosts] = useState<Post[]>(null!);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPosts(data.posts);
        }
      });
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Typography variant="h2">Walrus</Typography>
      <Typography variant="body1">EZ Image Uploading</Typography>
      <Box display="flex" flexDirection="row">
        {!localStorage.getItem("authorized") ? (
          <>
            <Button
              onClick={() => window.location.replace("/auth/github")}
              variant="contained"
            >
              Github
            </Button>
            <Link to="/login">
              <Button variant="contained">Login</Button>
            </Link>
            <Link to="/register">
              <Button variant="contained">Register</Button>
            </Link>
          </>
        ) : null}
      </Box>

      <Box display="flex" flexDirection="row" flexWrap="wrap">
        {posts &&
          posts.map((post: Post) => (
            <Paper elevation={2} key={post.images[0].id}>
              <Box display="flex" justifyContent="center" alignItems="center">
                <Link to={`/post/${post.images[0].postId}/`}>
                  <img src={`/i/${post.images[0].thumbnailPath}/`}></img>
                </Link>
              </Box>
              <Typography>{post.title}</Typography>
            </Paper>
          ))}
      </Box>
    </Box>
  );
};

export default Home;
