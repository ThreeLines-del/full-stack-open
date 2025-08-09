const logger = require("./logger");

const errorHandler = (error, request, response, next) => {
  logger.error(error);

  if (error.name === "CastError") {
    return response.status(400).json({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  // Default to 500 Internal Server Error
  return response.status(500).json({ error: "something went wrong" });
};

module.exports = {
  errorHandler,
};
