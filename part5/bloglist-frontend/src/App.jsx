import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import { userLogin } from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("loggedBlogAppUser"));
    return user;
  });
  const [blogDetails, setBlogDetails] = useState({
    title: "",
    author: "",
    url: "",
  });
  const [message, setMessage] = useState(null);
  const [errorMesssage, setErrorMessage] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const handleSetBlogDetails = (event) => {
    const { name, value } = event.target;
    setBlogDetails((prev) => ({ ...prev, [name]: value }));
  };

  async function handleLogin(event) {
    event.preventDefault();

    try {
      const user = await userLogin({ username, password });

      localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      setUser(user);

      setMessage(`${user?.name} logged-in`);
      setTimeout(() => {
        setMessage("");
      }, 5000);

      setUsername("");
      setPassword("");
    } catch (error) {
      console.log(error);
      setErrorMessage(error.response.data.error);
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("loggedBlogAppUser");
    setUser(null);
  };

  const handleCreateBlog = async (event) => {
    event.preventDefault();

    try {
      const newBlog = await blogService.create(blogDetails);
      setBlogs((prev) => [...prev, newBlog]);

      setMessage(`a new blog ${newBlog?.title} by ${newBlog?.author}`);
      setTimeout(() => {
        setMessage("");
      }, 5000);

      setBlogDetails({ title: "", author: "", url: "" });
    } catch (error) {
      setErrorMessage(error.response.data.error);
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  };

  const loginForm = () => (
    <>
      <h2>login to application</h2>

      {message ? <div className="message">{message}</div> : null}
      {errorMesssage ? <div className="error">{errorMesssage}</div> : null}

      <form onSubmit={handleLogin}>
        username{" "}
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
        />
        <br />
        password{" "}
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="text"
        />
        <br />
        <button>login</button>
      </form>
    </>
  );

  const blogList = () => (
    <>
      <h2>blogs</h2>

      {message ? <div className="message">{message}</div> : null}
      {errorMesssage ? <div className="error">{errorMesssage}</div> : null}

      <p>
        {user?.name} logged-in <button onClick={handleLogout}>logout</button>
      </p>

      <h2>create new</h2>
      <form onSubmit={handleCreateBlog}>
        title{" "}
        <input
          name="title"
          value={blogDetails.title}
          onChange={handleSetBlogDetails}
          type="text"
        />
        <br />
        author{" "}
        <input
          name="author"
          value={blogDetails.author}
          onChange={handleSetBlogDetails}
          type="text"
        />
        <br />
        url{" "}
        <input
          name="url"
          value={blogDetails.url}
          onChange={handleSetBlogDetails}
          type="text"
        />
        <br />
        <button>create</button>
      </form>

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </>
  );

  return <div>{user ? blogList() : loginForm()}</div>;
};

export default App;
