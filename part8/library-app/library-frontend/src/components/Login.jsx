import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { USER_LOGIN } from "../queries";
import { useEffect } from "react";
import { useContext } from "react";
import TokenContext from "../TokenContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [userCreds, setUserCreds] = useState({
    username: "",
    password: "",
  });
  const [login, result] = useMutation(USER_LOGIN, {
    onError: (error) => {
      console.log(error);
    },
  });
  const { setToken } = useContext(TokenContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem("libraryapptoken", token);
    }
  }, [result.data]);

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setUserCreds((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async () => {
    const data = await login({
      variables: {
        username: userCreds.username,
        password: userCreds.password,
      },
    });

    data.data ? navigate("/") : null;
  };

  return (
    <div>
      username:{" "}
      <input
        name="username"
        value={userCreds.username}
        onChange={handleOnChange}
        type="text"
      />
      <br />
      password:{" "}
      <input
        name="password"
        value={userCreds.password}
        onChange={handleOnChange}
        type="text"
      />
      <br />
      <button onClick={onSubmit}>login</button>
    </div>
  );
};

export default Login;
