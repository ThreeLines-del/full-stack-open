import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Typography, List, ListItem, ListItemText, Paper } from "@mui/material";

const User = () => {
  const { id } = useParams();
  const allBlogs = useSelector((state) => state.blogs);

  const blogs = useMemo(
    () => allBlogs.filter((blog) => blog.user?.id === id),
    [allBlogs, id]
  );

  const userName = blogs.length > 0 ? blogs[0].user.name : null;

  if (!userName) {
    return <Typography variant="h6">User not found</Typography>;
  }

  return (
    <Paper sx={{ padding: 2, marginTop: 2 }}>
      <Typography variant="h4" gutterBottom>
        {userName}
      </Typography>
      <Typography variant="h6">Added blogs</Typography>
      <List>
        {blogs.map((blog) => (
          <ListItem key={blog.id}>
            <ListItemText primary={blog.title} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default User;
