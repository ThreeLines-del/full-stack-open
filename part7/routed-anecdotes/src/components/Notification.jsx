import { useContext } from "react";
import NotificationContext from "../context/NotificationContext";

const Notification = () => {
  const notificationContext = useContext(NotificationContext);
  const { notification } = notificationContext;

  return notification ? <div>{notification}</div> : null;
};

export default Notification;
