import Person from "./Person";

const Persons = ({ persons, handleOnDelete }) => {
  return (
    <div>
      {persons.map((person, i) => (
        <Person
          key={i}
          person={person}
          handleOnDelete={() => handleOnDelete(person.id)}
        />
      ))}
    </div>
  );
};

export default Persons;
