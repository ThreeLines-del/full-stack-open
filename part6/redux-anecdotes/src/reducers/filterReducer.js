const filterReducer = (state = "", action) => {
  switch (action.type) {
    case "SET_FILTER":
      return action.payload.query;

    default:
      return state;
  }
};

export const setFilter = (query) => {
  return {
    type: "SET_FILTER",
    payload: { query },
  };
};

export default filterReducer;
