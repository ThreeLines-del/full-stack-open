import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdoteService";

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    addToList(state, action) {
      return [...state, action.payload];
    },
    addVote(state, action) {
      const item = state.find((a) => a.id === action.payload);
      const newItem = { ...item, votes: item.votes + 1 };
      const newList = state.map((a) => (a.id === newItem.id ? newItem : a));
      return newList;
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
    replaceAnecdote(state, action) {
      return state.map((anecdote) =>
        anecdote.id === action.payload.id ? action.payload : anecdote
      );
    },
  },
});

export const { addToList, addVote, setAnecdotes, replaceAnecdote } =
  anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.create(content);
    dispatch(addToList(newAnecdote));
  };
};

export const updateAnecdote = (id) => {
  return async (dispatch, getState) => {
    const anecdotesState = getState().anecdotes;
    const anecdotetoUpdate = anecdotesState.find((a) => a.id === id);
    const newObj = {
      ...anecdotetoUpdate,
      votes: anecdotetoUpdate.votes + 1,
    };

    const updatedAnecdote = await anecdoteService.update(id, newObj);
    dispatch(replaceAnecdote(updatedAnecdote));
  };
};

export default anecdoteSlice.reducer;
