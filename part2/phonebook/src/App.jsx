import { useState } from "react";
import Filter from "./Filter";
import PersonForm from "./PersonForm";
import Persons from "./Persons";
import { useEffect } from "react";
import "./index.css";
import personService from "./services/persons";
import Notification from "./Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    personService.getAll().then((personsArr) => setPersons(personsArr));
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    const duplicate = persons.find((person) => person.name === newName);

    if (duplicate) {
      if (
        window.confirm(
          `${duplicate.name} is already added to the phonebook, replace the old number with new one?`
        )
      ) {
        const updatedPerson = { ...duplicate, number: newNumber };

        personService
          .update(duplicate.id, updatedPerson)
          .then((res) => {
            setPersons(
              persons.map((person) =>
                person.id === duplicate.id ? res : person
              )
            );
            setMessage(`Changed ${res.name}'s number`);
            setTimeout(() => {
              setMessage("");
            }, [3000]);
          })
          .catch(() => {
            setErrorMessage(
              `Information of ${duplicate.name} has already been removed from server`
            );
            setPersons(persons.filter((person) => person.id !== duplicate.id));
            setTimeout(() => {
              setErrorMessage("");
            }, [3000]);
          });

        setNewName("");
        setNewNumber("");
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
      };

      personService.create(newPerson).then((person) => {
        setPersons([...persons, person]);
        setMessage(`Added ${person.name}`);
        setTimeout(() => {
          setMessage("");
        }, [3000]);
      });

      setNewName("");
      setNewNumber("");
    }
  }

  function handleOnDelete(id) {
    const person = persons.find((person) => person.id === id);

    if (window.confirm(`Delete ${person.name} ?`)) {
      personService.deletePerson(id).then((deletedItem) => {
        setPersons((persons) =>
          persons.filter((person) => person.id !== deletedItem.id)
        );
      });
    }
  }

  const filteredPersons = searchQuery
    ? persons.filter((person) =>
        person.name
          .toLocaleLowerCase()
          .includes(searchQuery.toLocaleLowerCase())
      )
    : persons;

  function handleNameOnChange(event) {
    setNewName(event.target.value);
  }

  function handleNumberOnChange(event) {
    setNewNumber(event.target.value);
  }

  function handleSearchOnChange(event) {
    setSearchQuery(event.target.value);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} errorMessage={errorMessage} />
      <Filter
        searchQuery={searchQuery}
        handleSearchOnChange={handleSearchOnChange}
      />
      <h2>add a new</h2>
      <PersonForm
        handleSubmit={handleSubmit}
        newName={newName}
        newNumber={newNumber}
        handleNameOnChange={handleNameOnChange}
        handleNumberOnChange={handleNumberOnChange}
      />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} handleOnDelete={handleOnDelete} />
    </div>
  );
};

export default App;
