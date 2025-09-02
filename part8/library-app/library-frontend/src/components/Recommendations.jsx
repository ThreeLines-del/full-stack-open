import { useQuery } from "@apollo/client/react";
import { CURRENT_USER, RECOMMENDATIONS } from "../queries";

const Recommendations = () => {
  const result = useQuery(RECOMMENDATIONS);
  const currentUser = useQuery(CURRENT_USER);
  const books = result.data?.recommendedBooks;

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre{" "}
        <strong>{currentUser.data?.me?.favoriteGenre}</strong>{" "}
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
    </div>
  );
};

export default Recommendations;
