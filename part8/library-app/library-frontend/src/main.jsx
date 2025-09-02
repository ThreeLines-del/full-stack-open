import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Authors from "./components/Authors.jsx";
import Books from "./components/Books.jsx";
import NewBook from "./components/NewBook.jsx";
import Login from "./components/Login.jsx";
import { TokenProvider } from "./TokenContext.jsx";
import Recommendations from "./components/Recommendations.jsx";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

// HTTP link for queries and mutations
const httpLink = new HttpLink({ uri: "http://localhost:4000/graphql" });

// Auth middleware for HTTP
const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("libraryapptoken");
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  }));
  return forward(operation);
});

// WebSocket link for subscriptions using graphql-ws
const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:4000/graphql",
    connectionParams: () => {
      const token = localStorage.getItem("libraryapptoken");
      return {
        headers: {
          authorization: token ? `Bearer ${token}` : "",
        },
      };
    },
  })
);

// Split link based on operation type
const splitLink = ApolloLink.split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

// Apollo Client
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Book: {
        keyFields: ["title"],
      },
      Author: {
        keyFields: ["name"],
      },
    },
  }),
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Authors />,
      },
      {
        path: "books",
        element: <Books />,
      },
      {
        path: "add",
        element: <NewBook />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "recommendations",
        element: <Recommendations />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <TokenProvider>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </TokenProvider>
);
