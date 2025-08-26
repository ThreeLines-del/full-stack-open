import { useState } from "react";
import { useDispatch } from "react-redux";
import { createBlog } from "../reducers/blogReducer";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const CreateBlogForm = ({ createBlogFormRef }) => {
  const dispatch = useDispatch();
  const [blogDetails, setBlogDetails] = useState({
    title: "",
    author: "",
    url: "",
  });

  const handleSetBlogDetails = (event) => {
    const { name, value } = event.target;
    setBlogDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateBlog = async (newBlog) => {
    dispatch(createBlog(newBlog));
    createBlogFormRef.current.toggleVisibility();
  };

  const addBlog = (event) => {
    event.preventDefault();
    handleCreateBlog(blogDetails);
    setBlogDetails({ title: "", author: "", url: "" });
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Create New Blog
      </Typography>
      <form onSubmit={addBlog}>
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={blogDetails.title}
          onChange={handleSetBlogDetails}
          margin="normal"
          required
          placeholder="blog title"
        />
        <TextField
          fullWidth
          label="Author"
          name="author"
          value={blogDetails.author}
          onChange={handleSetBlogDetails}
          margin="normal"
          required
          placeholder="blog author"
        />
        <TextField
          fullWidth
          label="URL"
          name="url"
          value={blogDetails.url}
          onChange={handleSetBlogDetails}
          margin="normal"
          required
          placeholder="blog url"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Create
        </Button>
      </form>
    </Box>
  );
};

export default CreateBlogForm;
