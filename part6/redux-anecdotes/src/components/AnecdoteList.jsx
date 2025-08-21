import { useDispatch, useSelector } from "react-redux";
import Anecdote from "./Anecdote";
import { useEffect } from "react";
import { initializeAnecdotes } from "../reducers/anecdoteReducer";

const AnecdoteList = () => {
  const dispatch = useDispatch();
  const anecdotes = useSelector((state) => {
    const query = state.filter;
    const anecdotes = state.anecdotes;
    return query
      ? anecdotes.filter((anecdote) =>
          anecdote.content.toLowerCase().includes(query.toLowerCase())
        )
      : anecdotes;
  });

  useEffect(() => {
    dispatch(initializeAnecdotes());
  }, []);

  return (
    <>
      {[...anecdotes]
        .sort((a, b) => b.votes - a.votes)
        .map((anecdote) => (
          <Anecdote key={anecdote.id} anecdote={anecdote} />
        ))}
    </>
  );
};

export default AnecdoteList;
