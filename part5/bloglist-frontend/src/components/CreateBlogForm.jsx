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
    </>
  );
};

export default CreateBlogForm;
