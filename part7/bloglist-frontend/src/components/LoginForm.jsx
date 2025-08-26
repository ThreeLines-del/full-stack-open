import { useState } from "react";
import { userLogin } from "../services/login";
import { useDispatch } from "react-redux";
import { setUser } from "../reducers/userReducer";
import Notification from "./Notification";
import { setNotification } from "../reducers/notificationReducer";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  async function handleLogin(event) {
    event.preventDefault();

    try {
      const user = await userLogin({ username, password });

      localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      dispatch(setUser(user));
      dispatch(setNotification(`${user?.name} logged-in`, "success", 5));

      setUsername("");
      setPassword("");
    } catch (error) {
      dispatch(
        setNotification(
          error.response?.data?.error || "Login failed",
          "error",
          5
        )
      );
    }
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, margin: "2rem auto" }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Login to Application
      </Typography>

      <Notification />

      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Username"
          data-testid="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
        />

        <TextField
          label="Password"
          data-testid="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          fullWidth
        />

        <Button variant="contained" color="primary" type="submit">
          Login
        </Button>
      </Box>
    </Paper>
  );
};

export default LoginForm;
