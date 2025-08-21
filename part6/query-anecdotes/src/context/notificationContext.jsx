import { useReducer } from "react";
import { createContext } from "react";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "NOTIFICATION": {
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

export const NotificationProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    ""
  );

  function handleDispatch(notification) {
    notificationDispatch({
      type: "NOTIFICATION",
      payload: notification,
    });

    setTimeout(() => {
      notificationDispatch({ type: "CLEAR" });
    }, 5000);
  }

  const contextObj = {
    notification,
    notificationDispatch,
    handleDispatch,
  };

  return (
    <NotificationContext.Provider value={contextObj}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
