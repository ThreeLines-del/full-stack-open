const PersonForm = (props) => {
  return (
    <form onSubmit={props.handleSubmit}>
      <div>
        name:{" "}
        <input value={props.newName} onChange={props.handleNameOnChange} />
        <div>
          number:{" "}
          <input
            value={props.newNumber}
            onChange={props.handleNumberOnChange}
          />
        </div>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
