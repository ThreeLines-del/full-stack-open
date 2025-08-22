import { useState } from "react";
import Menu from "./components/Menu";
import AnecdoteList from "./components/AnecdoteList";
import About from "./components/About";
import CreateNew from "./components/CreateNew";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu />
      <Outlet />
      <Footer />
    </div>
  );
};

export default App;
