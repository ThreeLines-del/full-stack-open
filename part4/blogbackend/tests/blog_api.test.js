const assert = require("node:assert");
const { beforeEach, test, describe, after } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./test_helper");

const api = supertest(app);

describe("with initial blogs saved", async () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
    await api
      .post("/api/users")
      .send({ username: "testuser", name: "user", password: "password123" });
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
      const loginResponse = await api
        .post("/api/login")
        .send({ username: "testuser", password: "password123" });

      const token = loginResponse.body.token;

      const newBlog = {
        title: "New Blog Title",
        author: "Test Author",
        url: "http://example.com",
        likes: 5,
      };

      const response = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response.body.title, newBlog.title);
      assert.strictEqual(response.body.author, newBlog.author);
      assert.strictEqual(response.body.likes, newBlog.likes);
      assert.strictEqual(response.body.url, newBlog.url);

      const blogsAfter = await helper.blogsinDb();
      assert.strictEqual(blogsAfter.length, helper.initialBlogs.length + 1);

      const titles = blogsAfter.map((b) => b.title);
      assert(titles.includes(newBlog.title));
    });

    test("adding a blog fails if token is not provided", async () => {
      const newBlogWithOutToken = {
        title: "Blog Without Token",
        author: "Test Author",
        url: "http://example.com",
      };

      await api
        .post("/api/blogs")
        .send(newBlogWithOutToken)
        .expect(401)
        .expect("Content-Type", /application\/json/);
    });

    test("defaults likes to 0 if missing from request", async () => {
      const loginResponse = await api
        .post("/api/login")
        .send({ username: "testuser", password: "password123" });

      const token = loginResponse.body.token;

      const newBlog = {
        title: "Blog Without Likes",
        author: "Test Author",
        url: "http://example.com",
      };

      const response = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
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
      const loginResponse = await api
        .post("/api/login")
        .send({ username: "testuser", password: "password123" });

      const token = loginResponse.body.token;

      const newBlog = {
        author: "Test Author",
        url: "http://example.com",
        likes: 2,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(400);

      const blogsAfter = await helper.blogsinDb();
      assert.strictEqual(blogsAfter.length, helper.initialBlogs.length);
    });

    test("fails with 400 Bad Request if url is missing", async () => {
      const loginResponse = await api
        .post("/api/login")
        .send({ username: "testuser", password: "password123" });

      const token = loginResponse.body.token;

      const newBlog = {
        title: "Blog Missing URL",
        author: "Test Author",
        likes: 2,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(400);

      const blogsAfter = await helper.blogsinDb();
      assert.strictEqual(blogsAfter.length, helper.initialBlogs.length);
    });
  });

  describe("deletion of a blog", () => {
    test("DELETE /api/blogs/:id deletes a blog post", async () => {
      const loginResponse = await api
        .post("/api/login")
        .send({ username: "testuser", password: "password123" });

      const token = loginResponse.body.token;

      const newBlog = {
        title: "Blog to delete",
        author: "Test",
        url: "http://example.com",
      };

      const createdBlog = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog);

      await api
        .delete(`/api/blogs/${createdBlog.body.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);
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
