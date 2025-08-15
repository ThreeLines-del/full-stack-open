import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import LoginForm from "./components/LoginForm";
import CreateBlogForm from "./components/CreateBlogForm";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("loggedBlogAppUser"));
    return user;
  });

  const [message, setMessage] = useState(null);
  const [errorMesssage, setErrorMessage] = useState(null);
  const createBlogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedBlogAppUser");
    setUser(null);
  };

  const handleCreateBlog = async (newObject) => {
    try {
      const newBlog = await blogService.create(newObject);
      setBlogs((prev) => [...prev, newBlog]);
      createBlogFormRef.current.toggleVisibility();

      setMessage(`a new blog ${newBlog?.title} by ${newBlog?.author}`);
      setTimeout(() => {
        setMessage("");
      }, 5000);
    } catch (error) {
      setErrorMessage(error.response.data.error);
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  };

  const handleUpdateBlog = async (id, newObject) => {
    const updatedBlog = await blogService.update(id, newObject);
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
    );
  };

  const handleDeleteBlog = async (blog) => {
    if (window.confirm(`Removing blog ${blog.title} by ${blog.author}`)) {
      await blogService.deleteOne(blog.id);
      setBlogs((prev) => prev.filter((b) => b.id !== blog.id));
    }
  };

  const blogList = () => (
    <>
      <h2>blogs</h2>

      {message ? <div className="message">{message}</div> : null}
      {errorMesssage ? <div className="error">{errorMesssage}</div> : null}

      <p>
        {user?.name} logged-in <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable ref={createBlogFormRef} buttonLabel={"new blog"}>
        <CreateBlogForm handleCreateBlog={handleCreateBlog} />
      </Togglable>

      {blogs
        .slice()
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleUpdateBlog={handleUpdateBlog}
            handleDeleteBlog={handleDeleteBlog}
            user={user}
          />
        ))}
    </>
  );

  return <div>{user ? blogList() : <LoginForm setUser={setUser} />}</div>;
};

export default App;
