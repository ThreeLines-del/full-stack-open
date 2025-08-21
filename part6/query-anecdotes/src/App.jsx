import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import anecdoteService from "./services/anecdoteService";
import { useContext } from "react";
import NotificationContext from "./context/notificationContext";

const App = () => {
  const queryClient = useQueryClient();
  const handleDispatch = useContext(NotificationContext).handleDispatch;

  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: anecdoteService.getAll,
    retry: false,
  });

  const updateAnecdoteMutation = useMutation({
    mutationFn: anecdoteService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
    },
  });

  const handleVote = (anecdote) => {
    const newAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1,
    };
    updateAnecdoteMutation.mutate(newAnecdote);
    handleDispatch(`anecdote "${anecdote.content}" voted`);
  };

  const anecdotes = result.data;

  if (result.isLoading) {
    return <div>loading data...</div>;
  } else if (result.isError) {
    return <div>service not available due to problems in server</div>;
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
