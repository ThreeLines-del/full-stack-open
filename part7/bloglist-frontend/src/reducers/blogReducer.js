import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";
import { setNotification } from "./notificationReducer";

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    addToList(state, action) {
      return [...state, action.payload];
    },
    setBlogs(state, action) {
      return action.payload;
    },
    replaceBlog(state, action) {
      const newBlog = action.payload;
      const blogList = state.map((blog) =>
        blog.id === newBlog.id ? newBlog : blog
      );
      return blogList;
    },
    filterBlogs(state, action) {
      const removedBlog = action.payload;
      return state.filter((blog) => blog.id !== removedBlog.id);
    },
  },
});

export const { addToList, setBlogs, replaceBlog, filterBlogs } =
  blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (newBlog) => {
  return async (dispatch) => {
    try {
      const blog = await blogService.create(newBlog);
      dispatch(addToList(blog));

      dispatch(
        setNotification(
          `a new blog ${newBlog?.title} by ${newBlog?.author}`,
          "success",
          5
        )
      );
    } catch (error) {
      dispatch(setNotification(error.response?.data?.error, "error", 5));
    }
  };
};

export const updateBlog = (blog) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.update(blog.id, blog);
    dispatch(replaceBlog(updatedBlog));
  };
};

export const deleteBlog = (blog) => {
  return async (dispatch) => {
    await blogService.deleteOne(blog.id);
    dispatch(filterBlogs(blog));
  };
};

export const addBlogComment = (blog, newComment) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.addComment(blog.id, newComment);
    dispatch(replaceBlog(updatedBlog));
  };
};

export default blogSlice.reducer;
