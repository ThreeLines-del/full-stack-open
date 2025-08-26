const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const { tokenExtractor, userExtractor } = require("../utils/middleware");

blogsRouter.get("/", async (request, response, next) => {
  try {
    const blog = await Blog.find({}).populate("user", { username: 1, name: 1 });
    response.json(blog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.post(
  "/",
  tokenExtractor,
  userExtractor,
  async (request, response, next) => {
    const { body } = request;

    try {
      const user = request.user;

      if (!user) {
        return response
          .status(400)
          .json({ error: "userId missing or not valid" });
      }

      const newBlog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id,
      };

      const blog = new Blog(newBlog);
      user.blogs = user.blogs.concat(blog._id);

      const savedBlog = await blog.save();
      const populatedBlog = await savedBlog.populate("user", {
        username: 1,
        name: 1,
      });
      await user.save();

      response.status(201).json(populatedBlog);
    } catch (error) {
      next(error);
    }
  }
);

blogsRouter.delete(
  "/:id",
  tokenExtractor,
  userExtractor,
  async (request, response, next) => {
    const { id } = request.params;

    try {
      const user = request.user;
      const blog = await Blog.findById(id);

      if (user._id.toString() === blog.user.toString()) {
        await Blog.findByIdAndDelete(id);

        response.status(204).end();
      } else {
        return response.status(401).json({ error: "not authorized" });
      }
    } catch (error) {
      next(error);
    }
  }
);

blogsRouter.put("/:id", async (request, response, next) => {
  const { id } = request.params;
  const updatedData = request.body;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { ...updatedData, user: updatedData.user._id },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    ).populate("user", { username: 1, name: 1 });

    if (updatedBlog) {
      response.json(updatedBlog);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/:id/comments", async (request, response, next) => {
  const { id } = request.params;
  const { comment } = request.body;

  if (!comment || comment.trim() === "") {
    return res.status(400).json({ error: "Comment is required" });
  }

  try {
    const blog = await Blog.findById(id).populate("user", {
      username: 1,
      name: 1,
    });

    if (!blog) {
      response.status(404).end();
    }

    blog.comments = blog.comments.concat(comment);
    const updatedBlog = await blog.save();

    response.json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
