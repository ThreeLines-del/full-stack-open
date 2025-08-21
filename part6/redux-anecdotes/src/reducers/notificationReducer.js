import { createSlice } from "@reduxjs/toolkit";

const anecdoteSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    setText(state, action) {
      return action.payload;
    },
    clearText(state, action) {
      return "";
    },
  },
});

export const { setText, clearText } = anecdoteSlice.actions;

export const setNotification = (text, secs) => {
  return async (dispatch) => {
    dispatch(setText(text));
    setTimeout(() => {
      dispatch(clearText());
    }, [secs * 1000]);
  };
};

export default anecdoteSlice.reducer;
