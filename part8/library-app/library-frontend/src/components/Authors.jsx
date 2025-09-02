import { useMutation, useQuery } from "@apollo/client/react";
import { ALL_AUTHORS, ALL_BOOKS, UPDATE_AUTHOR_YEAR } from "../queries";
import { useState } from "react";
import Select from "react-select";
import { useContext } from "react";
import TokenContext from "../TokenContext";

const Authors = () => {
  const result = useQuery(ALL_AUTHORS);
  const authors = result.data?.allAuthors;
  const [born, setBorn] = useState("");
  const [updateAuthorYear] = useMutation(UPDATE_AUTHOR_YEAR, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    onError: (error) => {
      console.log(error.message);
    },
  });
  const [selectedOption, setSelectedOption] = useState(null);
  const options = authors?.map((author) => {
    const a = { value: author.name, label: author.name };
    return a;
  });
  const { token } = useContext(TokenContext);

  const updateAuthor = () => {
    updateAuthorYear({
      variables: {
        name: selectedOption.value,
        setBornTo: Number(born),
      },
    });
  };

  if (result.loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors?.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {token ? (
        <>
          <h2>Set birthyear</h2>
          <Select
            defaultValue={selectedOption}
            onChange={setSelectedOption}
            options={options}
          />
          <div>
            born:{" "}
            <input
              value={born}
              onChange={(e) => setBorn(e.target.value)}
              type="number"
            />
            <br />
            <button onClick={updateAuthor}>update author</button>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Authors;
