import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: { message: "", type: "success" },
  reducers: {
    setNotificationState(state, action) {
      return action.payload;
    },
    clearNotification(state, action) {
      return { message: "", type: "success" };
    },
  },
});

export const { setNotificationState, clearNotification } =
  notificationSlice.actions;

export const setNotification = (message, type, secs) => {
  return async (dispatch) => {
    dispatch(setNotificationState({ message, type }));
    setTimeout(() => {
      dispatch(clearNotification());
    }, secs * 1000);
  };
};

export default notificationSlice.reducer;
