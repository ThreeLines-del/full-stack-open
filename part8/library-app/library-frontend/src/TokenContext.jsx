import { useState } from "react";
import { createContext } from "react";

const TokenContext = createContext();

export const TokenProvider = (props) => {
  const [token, setToken] = useState(() => {
    return localStorage.getItem("libraryapptoken");
  });

  const contextObj = {
    token,
    setToken,
  };
  return (
    <TokenContext.Provider value={contextObj}>
      {props.children}
    </TokenContext.Provider>
  );
};

export default TokenContext;
