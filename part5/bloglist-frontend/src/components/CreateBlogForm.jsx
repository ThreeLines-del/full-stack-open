import { useState } from "react";

const CreateBlogForm = ({ handleCreateBlog }) => {
  const [blogDetails, setBlogDetails] = useState({
    title: "",
    author: "",
    url: "",
  });

  const handleSetBlogDetails = (event) => {
    const { name, value } = event.target;
    setBlogDetails((prev) => ({ ...prev, [name]: value }));
  };

  const addBlog = (event) => {
    event.preventDefault();
    handleCreateBlog(blogDetails);

    setBlogDetails({ title: "", author: "", url: "" });
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        title{" "}
        <input
          data-testid="title"
          name="title"
          value={blogDetails.title}
          onChange={handleSetBlogDetails}
          type="text"
          placeholder="blog title"
        />
        <br />
        author{" "}
        <input
          data-testid="author"
          name="author"
          value={blogDetails.author}
          onChange={handleSetBlogDetails}
          type="text"
          placeholder="blog author"
        />
        <br />
        url{" "}
        <input
          data-testid="url"
          name="url"
          value={blogDetails.url}
          onChange={handleSetBlogDetails}
          type="text"
          placeholder="blog url"
        />
        <br />
        <button>create</button>
      </form>
    </>
  );
};

export default CreateBlogForm;
