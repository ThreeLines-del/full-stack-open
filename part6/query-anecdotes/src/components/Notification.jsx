import { useContext } from "react";
import NotificationContext from "../context/notificationContext";

const Notification = () => {
  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  };

  const notification = useContext(NotificationContext).notification;

  return notification ? <div style={style}>{notification}</div> : null;
};

export default Notification;
