import { useState } from "react";
import { userLogin } from "../services/login";

const LoginForm = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMesssage, setErrorMessage] = useState(null);

  async function handleLogin(event) {
    event.preventDefault();

    try {
      const user = await userLogin({ username, password });

      localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      setUser(user);

      setMessage(`${user?.name} logged-in`);
      setTimeout(() => {
        setMessage("");
      }, 5000);

      setUsername("");
      setPassword("");
    } catch (error) {
      console.log(error);
      setErrorMessage(error.response.data.error);
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  }
  return (
    <>
      <h2>login to application</h2>

      {message ? <div className="message">{message}</div> : null}
      {errorMesssage ? <div className="error">{errorMesssage}</div> : null}

      <form onSubmit={handleLogin}>
        username{" "}
        <input
          data-testid="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
        />
        <br />
        password{" "}
        <input
          data-testid="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="text"
        />
        <br />
        <button>login</button>
      </form>
    </>
  );
};

export default LoginForm;
