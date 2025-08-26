import { useSelector } from "react-redux";

const Notification = () => {
  const { message, type } = useSelector((state) => state.notification);
  const className = type === "error" ? "error" : "message";

  return message ? <div className={className}>{message}</div> : null;
};

export default Notification;
