const Filter = ({ searchQuery, handleSearchOnChange }) => {
  return (
    <div>
      filter shown with:{" "}
      <input value={searchQuery} onChange={handleSearchOnChange} />
    </div>
  );
};

export default Filter;
