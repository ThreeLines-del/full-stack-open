import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AnecdoteList from "./components/AnecdoteList";
import CreateNew from "./components/CreateNew";
import About from "./components/About";
import { AnecdoteProvider } from "./context/AnecdoteContext";
import Anecdote from "./components/Anecdote";
import { NotificationProvider } from "./context/NotificationContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <AnecdoteList />,
      },
      {
        path: "create",
        element: <CreateNew />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "anecdotes/:id",
        element: <Anecdote />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <NotificationProvider>
    <AnecdoteProvider>
      <RouterProvider router={router} />
    </AnecdoteProvider>
  </NotificationProvider>
);
