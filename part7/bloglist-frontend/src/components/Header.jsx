import { Link as RouterLink } from "react-router-dom";
import Notification from "./Notification";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

const Header = ({ user, handleLogout }) => {
  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: "flex", gap: 2 }}>
            <Link
              component={RouterLink}
              to="."
              color="inherit"
              underline="none"
              variant="button"
            >
              Blogs
            </Link>
            <Link
              component={RouterLink}
              to="/users"
              color="inherit"
              underline="none"
              variant="button"
            >
              Users
            </Link>
          </Box>

          {user && (
            <>
              <Typography variant="body1" sx={{ marginRight: 2 }}>
                {user.name} logged in
              </Typography>
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ mt: 2 }}>
        <Notification />
      </Box>
    </>
  );
};

export default Header;
