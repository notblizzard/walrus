import React from "react";
import { Avatar as MaterialUIAvatar } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";

interface GravatarProps {
  path: string;
  size: number;
}

type StyleProps = Pick<GravatarProps, "size">;

const useStyles = makeStyles((theme: Theme) => ({
  avatar: (props: StyleProps) => ({
    height: theme.spacing(props.size),
    width: theme.spacing(props.size),
  }),
}));

const Avatar = ({ path, size }: GravatarProps): JSX.Element => {
  let url = path;
  const classes = useStyles({ size });
  if (!path.includes("gravatar")) {
    url = `/avatar/${path}`;
  }

  return <MaterialUIAvatar src={url} className={classes.avatar} />;
};

export default Avatar;
