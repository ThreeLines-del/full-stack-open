import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  addBlogComment,
  updateBlog,
  deleteBlog,
} from "../reducers/blogReducer";
import {
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import { setNotification } from "../reducers/notificationReducer";

const BlogView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users);
  const blog = useSelector((state) => state.blogs.find((b) => b.id === id));
  const navigate = useNavigate();

  if (!blog) return null;

  const handleBlogLikeUpdate = (newObject) => {
    const updateLike = { ...newObject, likes: newObject?.likes + 1 };
    dispatch(updateBlog(updateLike));
  };

  const handleDeleteBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      dispatch(deleteBlog(blog));
      navigate("../");
      dispatch(setNotification(`${blog.title} removed`, "success", 5));
    }
  };

  const handleAddComment = (event) => {
    event.preventDefault();
    const newComment = event.target.elements.comment.value;
    if (newComment.trim()) {
      dispatch(addBlogComment(blog, newComment));
      event.target.elements.comment.value = "";
    }
  };

  return (
    <Card sx={{ marginTop: 2, padding: 2 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          {blog.title}
        </Typography>

        <Typography variant="body1">
          <a href={blog.url} target="_blank" rel="noopener noreferrer">
            {blog.url}
          </a>
        </Typography>

        <Box mt={1} mb={1}>
          <Typography variant="body2" component="span">
            {blog.likes} likes{" "}
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleBlogLikeUpdate(blog)}
          >
            like
          </Button>
        </Box>

        <Typography variant="body2" gutterBottom>
          added by {blog.user?.name}{" "}
          {user?.username === blog.user?.username && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handleDeleteBlog}
            >
              remove
            </Button>
          )}
        </Typography>

        <Typography variant="h6" mt={2}>
          Comments
        </Typography>
        <form onSubmit={handleAddComment}>
          <TextField
            name="comment"
            size="small"
            label="Write a comment..."
            variant="outlined"
            sx={{ marginRight: 1, marginTop: 1 }}
          />
          <Button type="submit" variant="contained" size="small">
            add comment
          </Button>
        </form>

        {blog.comments && blog.comments.length > 0 ? (
          <List>
            {blog.comments.map((comment, i) => (
              <ListItem key={i}>
                <ListItemText primary={comment} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" mt={1}>
            no comments
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default BlogView;
