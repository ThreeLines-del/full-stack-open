const assert = require("node:assert");
const { beforeEach, test, describe, after } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./test_helper");

const api = supertest(app);

describe("with initial blogs saved", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
  });

  test("return blogs in JSON format", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test("unique identifier, named id", async () => {
    const response = await api.get("/api/blogs");
    const blog = response._body[0];

    assert.ok(blog.id, "68977016d60958fef56d4f0e");
  });

  describe("addition of a new blog", async () => {
    test("creates new blog and increases count by one", async () => {
      const newBlog = {
        title: "New Blog Title",
        author: "Test Author",
        url: "http://example.com",
        likes: 5,
      };

      const response = await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response._body.title, newBlog.title);
      assert.strictEqual(response._body.author, newBlog.author);
      assert.strictEqual(response._body.likes, newBlog.likes);
      assert.strictEqual(response._body.url, newBlog.url);

      const blogsAfter = await helper.blogsinDb();
      assert.strictEqual(blogsAfter.length, helper.initialBlogs.length + 1);

      const titles = blogsAfter.map((b) => b.title);
      assert(titles.includes(newBlog.title));
    });

    test("defaults likes to 0 if missing from request", async () => {
      const newBlog = {
        title: "Blog Without Likes",
        author: "Test Author",
        url: "http://example.com",
      };

      const response = await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response.body.likes, 0);

      const blogsAfter = await helper.blogsinDb();
      const savedBlog = blogsAfter.find((b) => b.title === newBlog.title);
      assert(savedBlog, "Blog should be saved in DB");
      assert.strictEqual(savedBlog.likes, 0);
    });

    test("fails with 400 Bad Request if title is missing", async () => {
      const newBlog = {
        author: "Test Author",
        url: "http://example.com",
        likes: 2,
      };

      await api.post("/api/blogs").send(newBlog).expect(400);

      const blogsAfter = await helper.blogsinDb();
      assert.strictEqual(blogsAfter.length, helper.initialBlogs.length);
    });

    test("fails with 400 Bad Request if url is missing", async () => {
      const newBlog = {
        title: "Blog Missing URL",
        author: "Test Author",
        likes: 2,
      };

      await api.post("/api/blogs").send(newBlog).expect(400);

      const blogsAfter = await helper.blogsinDb();
      assert.strictEqual(blogsAfter.length, helper.initialBlogs.length);
    });
  });

  describe("deletion of a blog", () => {
    test("DELETE /api/blogs/:id deletes a blog post", async () => {
      const blogsAtStart = await helper.blogsinDb();
      const blogToDelete = blogsAtStart[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

      const blogsAtEnd = await helper.blogsinDb();

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);

      const ids = blogsAtEnd.map((b) => b.id);
      assert(!ids.includes(blogToDelete.id));
    });
  });

  describe("updating of a blog", () => {
    test("PUT /api/blogs/:id updates the likes of a blog post", async () => {
      const blogsAtStart = await helper.blogsinDb();
      const blogToUpdate = blogsAtStart[0];

      const updatedData = {
        likes: blogToUpdate.likes + 10,
      };

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedData)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response.body.likes, updatedData.likes);

      const blogAtEnd = await Blog.findById(blogToUpdate.id);
      assert.strictEqual(blogAtEnd.likes, updatedData.likes);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
