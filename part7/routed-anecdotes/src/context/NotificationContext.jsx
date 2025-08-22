import { createContext, useReducer } from "react";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "NOTIFY": {
      return action.payload;
    }
    case "CLEAR": {
      return "";
    }

    default:
      return state;
  }
};

const NotificationContext = createContext();

export function NotificationProvider(props) {
  const [notification, dispatch] = useReducer(notificationReducer, "");

  const dispatchNotification = (text) => {
    dispatch({
      type: "NOTIFY",
      payload: text,
    });

    setTimeout(() => {
      dispatch({
        type: "CLEAR",
      });
    }, 5000);
  };

  const contextObj = { notification, dispatchNotification };

  return (
    <NotificationContext.Provider value={contextObj}>
      {props.children}
    </NotificationContext.Provider>
  );
}

export default NotificationContext;
