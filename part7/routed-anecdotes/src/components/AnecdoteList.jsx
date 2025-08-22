import { useContext, useState } from "react";
import AnecdoteContext from "../context/AnecdoteContext";
import { Link } from "react-router-dom";
import Notification from "./Notification";

const AnecdoteList = () => {
  const anecdoteContext = useContext(AnecdoteContext);
  const { anecdotes, setAnecdotes } = anecdoteContext;

  const anecdoteById = (id) => anecdotes.find((a) => a.id === id);

  const vote = (id) => {
    const anecdote = anecdoteById(id);

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1,
    };

    setAnecdotes(anecdotes.map((a) => (a.id === id ? voted : a)));
  };

  return (
    <div>
      <Notification />
      <h2>Anecdotes</h2>
      <ul>
        {anecdotes.map((anecdote) => (
          <li key={anecdote.id}>
            <Link to={`anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnecdoteList;
