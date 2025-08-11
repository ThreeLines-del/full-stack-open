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

      await blog.save();
      await user.save();

      response.status(201).json(blog);
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
    const updatedBlog = await Blog.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
      context: "query",
    });

    if (updatedBlog) {
      response.json(updatedBlog);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
