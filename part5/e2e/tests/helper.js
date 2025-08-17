const userLogin = async (page, username, password) => {
  await page.getByTestId("username").fill(username);
  await page.getByTestId("password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
};

const createUser = async (request, name, username, password) => {
  await request.post("http://localhost:3003/api/users", {
    data: {
      name: name,
      username: username,
      password: password,
    },
  });
};

const createBlog = async (page, title, author, url) => {
  await page.getByRole("button", { name: "new blog" }).click();
  await page.getByTestId("title").fill(title);
  await page.getByTestId("author").fill(author);
  await page.getByTestId("url").fill(url);
  await page.getByRole("button", { name: "create" }).click();
};

export { userLogin, createBlog, createUser };
