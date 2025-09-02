import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS } from "../queries";
import { useState } from "react";

const Books = () => {
  const [genre, setGenre] = useState("all genres");
  const result = useQuery(ALL_BOOKS, {
    variables: {
      genre: genre === "all genres" ? "" : genre,
    },
  });
  const books = result.data?.allBooks;

  if (result.loading) {
    return <p>Loading...</p>;
  }

  const genres = [
    "refactoring",
    "agile",
    "patterns",
    "design",
    "crime",
    "classic",
    "all genres",
  ];

  return (
    <div>
      <h2>books</h2>
      <p>
        in genre <strong>{genre}</strong>
      </p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books?.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author?.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.map((genre, i) => (
        <button key={i} onClick={() => setGenre(genre)}>
          {genre}
        </button>
      ))}
    </div>
  );
};

export default Books;
