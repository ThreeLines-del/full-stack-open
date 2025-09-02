import { useContext } from "react";
import { data, Link, Outlet, useNavigate } from "react-router-dom";
import TokenContext from "./TokenContext";
import { useApolloClient, useSubscription } from "@apollo/client/react";
import { BOOK_ADDED, BOOK_DETAILS } from "./queries";

const App = () => {
  const { token, setToken } = useContext(TokenContext);
  const client = useApolloClient();
  const navigate = useNavigate();

  const logout = () => {
    setToken("");
    localStorage.clear();
    client.resetStore();
    navigate("/");
  };

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded;
      alert(`${addedBook.title} added`);
      client.cache.modify({
        fields: {
          allBooks(existingBookRefs = [], { readField }) {
            const alreadyExists = existingBookRefs.some(
              (ref) => readField("title", ref) === addedBook.title
            );
            if (alreadyExists) {
              return existingBookRefs;
            }

            const newBookRef = client.cache.writeFragment({
              data: addedBook,
              fragment: BOOK_DETAILS,
            });

            return [...existingBookRefs, newBookRef];
          },
        },
      });
    },
  });

  return (
    <div>
      <div>
        <Link to={"."}>
          <button>authors</button>
        </Link>
        <Link to={"books"}>
          <button>books</button>
        </Link>

        {token ? (
          <>
            <Link to={"add"}>
              <button>add book</button>
            </Link>
            <Link to={"recommendations"}>
              <button>recommend</button>
            </Link>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <Link replace to={"login"}>
            <button>login</button>
          </Link>
        )}
      </div>

      <Outlet />
    </div>
  );
};

export default App;
