import { useContext, useState } from "react";
import AnecdoteContext from "../context/AnecdoteContext";
import NotificationContext from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import { useField } from "../hooks";

const CreateNew = () => {
  const anecdoteContext = useContext(AnecdoteContext);
  const notificationContext = useContext(NotificationContext);
  const { anecdotes, setAnecdotes } = anecdoteContext;
  const { dispatchNotification } = notificationContext;
  const navigate = useNavigate();

  const content = useField("text", "content");
  const author = useField("text", "author");
  const info = useField("text", "info");

  const { reset: resetContent, ...contentProps } = content;
  const { reset: resetAuthor, ...authorProps } = author;
  const { reset: resetInfo, ...infoProps } = info;

  const handleSubmit = (e) => {
    e.preventDefault();
    addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0,
    });
  };

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000);
    setAnecdotes(anecdotes.concat(anecdote));
    dispatchNotification(`a new anecdote ${anecdote.content} created!`);
    navigate("/");
  };

  const handleReset = (event) => {
    event.preventDefault();
    resetContent();
    resetAuthor();
    resetInfo();
  };

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...contentProps} />
        </div>
        <div>
          author
          <input {...authorProps} />
        </div>
        <div>
          url for more info
          <input {...infoProps} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={handleReset}>
          reset
        </button>
      </form>
    </div>
  );
};

export default CreateNew;
