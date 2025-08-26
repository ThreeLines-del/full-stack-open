import { useRef } from "react";
import { useSelector } from "react-redux";
import Togglable from "./Togglable";
import CreateBlogForm from "./CreateBlogForm";
import Blog from "./Blog";

const BlogList = () => {
  const createBlogFormRef = useRef();
  const blogs = useSelector((state) => state.blogs);

  return (
    <>
      <Togglable ref={createBlogFormRef} buttonLabel={"new blog"}>
        <CreateBlogForm createBlogFormRef={createBlogFormRef} />
      </Togglable>

      {blogs
        .slice()
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
    </>
  );
};

export default BlogList;
