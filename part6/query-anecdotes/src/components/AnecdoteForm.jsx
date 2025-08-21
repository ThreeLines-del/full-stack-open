import { useMutation, useQueryClient } from "@tanstack/react-query";
import anecdoteService from "../services/anecdoteService";
import { useContext } from "react";
import NotificationContext from "../context/notificationContext";

const AnecdoteForm = () => {
  const handleDispatch = useContext(NotificationContext).handleDispatch;
  const queryClient = useQueryClient();
  const newAnecdoteMutation = useMutation({
    mutationFn: anecdoteService.createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
    },
    onError: (error) => {
      handleDispatch(`Error: ${error.response?.data?.error || error.message}`);
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;

    if (content.length < 5) {
      handleDispatch("Error: anecdote must be at least 5 characters long");
      return;
    }

    newAnecdoteMutation.mutate(
      { content, votes: 0 },
      {
        onSuccess: () => {
          handleDispatch(`anecdote "${content}" created`);
          event.target.anecdote.value = "";
        },
      }
    );
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
