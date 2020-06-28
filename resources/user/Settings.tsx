import React, { useState, useEffect } from "react";
import {
  Switch,
  Box,
  Typography,
  makeStyles,
  Theme,
  fade,
  TextField,
  darken,
  Button,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";

interface User {
  id: number;
  createdAt: string;
  updatedAt: string;
  email: string;
  githubId: string;
  username: string;
  avatarPath: string;
}

interface SettingsData {
  username: string;
  email: string;
}

interface ErrorsData {
  username: string[];
  email: string[];
}

const useStyles = makeStyles((theme: Theme) => ({
  input: {
    margin: theme.spacing(1),

    "& .MuiFormLabel-root": {
      color: "#eee",
    },
    "& .MuiOutlinedInput-root": {
      color: "#eee",
      backgroundColor: fade("#66d0f9", 0.1),
      borderRadius: theme.shape.borderRadius,

      "&.Mui-focused fieldset": {
        borderColor: "#23f0c7",
      },
    },
    width: "40%",
    "&:focus": {
      borderColor: "#eee",
    },
  },
  button: {
    backgroundColor: "#23f0c7",
    width: "40%",
    "&:hover": {
      backgroundColor: darken("#23f0c7", 0.1),
    },
  },
}));
const Settings = (): JSX.Element => {
  const csrf = Cookies.get("X-CSRF-TOKEN")!;
  const classes = useStyles();
  const history = useHistory();
  const [useGravatar, setUseGravatar] = useState(false);
  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUseGravatar(!useGravatar);
  };

  const [settings, setSettings] = useState<SettingsData>({
    username: "",
    email: "",
  });

  const [errors, setErrors] = useState<ErrorsData>({
    username: [],
    email: [],
  });

  const handleSettingsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const target = e.target.getAttribute("name")!;
    setSettings({ ...settings, [target]: e.target.value });
  };

  useEffect(() => {
    fetch("/api/user/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data.user);
        setUseGravatar(data.user.avatarPath.includes("gravatar"));
      });
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    fetch("/api/user/settings", {
      method: "POST",
      headers: {
        "X-CSRF-Token": csrf,
      },
      body: JSON.stringify({
        username: settings.username,
        email: settings.email,
        gravatar: useGravatar,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          history.push("/");
        } else {
          const errorsMap = { username: [], email: [] } as ErrorsData;
          const errorsList = data.error.toLowerCase().split("\n");
          errorsList.forEach((error: string) => {
            if (error.includes("username")) {
              errorsMap.username = ["Username must be more than 2 characters."];
            }
            if (error.includes("email")) {
              errorsMap.email = ["Email must be a valid email."];
            }
          });
          setErrors(errorsMap);
        }
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Typography>Use Gravatar</Typography>
        <Switch checked={useGravatar} onChange={handleSwitchChange} />

        <TextField
          name="username"
          id="outlined-basic"
          label="Username"
          onChange={handleSettingsChange}
          value={settings.username}
          variant="outlined"
          error={errors.username.length > 0}
          helperText={errors.username.join("\n")}
          classes={{
            root: classes.input,
          }}
        />
        <TextField
          name="email"
          id="outlined-basic"
          label="E-Mail"
          type="email"
          onChange={handleSettingsChange}
          value={settings.email}
          error={errors.email.length > 0}
          helperText={errors.email.join("\n")}
          variant="outlined"
          classes={{
            root: classes.input,
          }}
        />

        <Button variant="contained" className={classes.button} type="submit">
          Submit
        </Button>
      </Box>
    </form>
  );
};

export default Settings;
