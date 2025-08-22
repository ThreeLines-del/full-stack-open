import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AnecdoteContext from "../context/AnecdoteContext";

const Anecdote = () => {
  const { getSingleAnecdote } = useContext(AnecdoteContext);
  const { id } = useParams();
  const [anecdote, setAnecdote] = useState();

  useEffect(() => {
    const singleAnecdote = getSingleAnecdote(Number(id));
    setAnecdote(singleAnecdote);
  }, [id]);

  return (
    <div>
      <h2>{anecdote?.content}</h2>
      <p>has {anecdote?.votes} votes</p>
      <p>
        for more info see <a href="#">{anecdote?.info}</a>
      </p>
    </div>
  );
};

export default Anecdote;
