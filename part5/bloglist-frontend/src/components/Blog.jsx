import { useState } from "react";

const Blog = ({ blog, handleUpdateBlog, handleDeleteBlog, user }) => {
  const [visibleBlog, setVisibleBlog] = useState(null);
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  function handleBlogLikeUpdate(id, newObject) {
    const updateLike = {
      ...newObject,
      likes: newObject?.likes + 1,
    };

    handleUpdateBlog(id, updateLike);
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}{" "}
      <button
        onClick={() => {
          setVisibleBlog(visibleBlog?.id === blog.id ? null : blog);
        }}
      >
        {visibleBlog?.id === blog.id ? "Hide" : "View"}
      </button>
      {visibleBlog?.id === blog.id && (
        <div>
          {blog.url}
          <br />
          {blog.likes}{" "}
          <button onClick={() => handleBlogLikeUpdate(blog.id, blog)}>
            like
          </button>
          <br />
          {blog.user.name}
          <br />
          {user?.username === blog?.user.username && (
            <button onClick={() => handleDeleteBlog(blog)}>remove</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
