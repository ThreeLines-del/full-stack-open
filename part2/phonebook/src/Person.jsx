const Person = ({ person, handleOnDelete }) => {
  return (
    <>
      <p>
        {person.name} {person.number}{" "}
        <button onClick={handleOnDelete}>delete</button>
      </p>
    </>
  );
};

export default Person;
