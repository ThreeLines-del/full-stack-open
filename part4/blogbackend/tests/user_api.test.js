const assert = require("node:assert");
const { beforeEach, test, describe, after } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");
const helper = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  await User.insertMany(helper.initialUsers);
});

describe("creating new users", async () => {
  test("user is created and present in DB", async () => {
    const newUser = {
      username: "myUser",
      name: "myUser",
      password: "myUser",
    };
    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const AtEnd = await helper.usersInDb();
    const content = AtEnd.map((u) => u.username);
    assert.strictEqual(content.includes(newUser.username), true);
  });

  test("user not created with password less than 3 chars", async () => {
    const userWithInvalidPassword = {
      username: "myUser",
      name: "myUser",
      password: "my",
    };

    await api
      .post("/api/users")
      .send(userWithInvalidPassword)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const AtEnd = await helper.usersInDb();
    assert.strictEqual(AtEnd.length, helper.initialUsers.length);
  });

  test("user not created with username less than 3 chars", async () => {
    const userWithInvalidUsername = {
      username: "my",
      name: "myUser",
      password: "myUser",
    };

    await api
      .post("/api/users")
      .send(userWithInvalidUsername)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const AtEnd = await helper.usersInDb();
    assert.strictEqual(AtEnd.length, helper.initialUsers.length);
  });

  test("user not created with username already in DB", async () => {
    const userWithDuplicateUsername = {
      username: "user1",
      name: "myUser",
      password: "myUser",
    };

    await api
      .post("/api/users")
      .send(userWithDuplicateUsername)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const AtEnd = await helper.usersInDb();
    assert.strictEqual(AtEnd.length, helper.initialUsers.length);
  });
});

after(() => {
  mongoose.connection.close();
});
