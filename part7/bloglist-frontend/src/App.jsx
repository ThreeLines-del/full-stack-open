import { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./reducers/userReducer";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { initializeBlogs } from "./reducers/blogReducer";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(initializeBlogs());
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedBlogAppUser"));
    dispatch(setUser(user));
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("loggedBlogAppUser");
    dispatch(setUser(null));
  };

  return (
    <div>
      {user ? (
        <div>
          <Header user={user} handleLogout={handleLogout} />
          <Outlet />
        </div>
      ) : (
        <LoginForm />
      )}
    </div>
  );
};

export default App;
