require("dotenv").config();
const express = require(`express`);
const morgan = require("morgan");
const Person = require("./models/person");
const person = require("./models/person");
const app = express();

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).json({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  // Default to 500 Internal Server Error
  return response.status(500).json({ error: "something went wrong" });
};

app.use(express.static("dist"));
app.use(express.json());
app.use(express.urlencoded());

morgan.token("body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  const { id } = req.params;

  Person.findById(id)
    .then((person) => {
      if (!person) {
        res.status(404).end();
      }

      res.status(200).json(person);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const { id } = req.params;

  Person.findByIdAndDelete(id)
    .then((result) => {
      if (result) {
        Person.find({}).then((updatedList) => res.json(updatedList));
      } else {
        res.status(204).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((newPerson) => res.json(newPerson))
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const { id } = req.params;
  const { name, number } = req.body;

  Person.findById(id)
    .then((person) => {
      if (!person) {
        return res.status(404).end();
      }

      person.name = name;
      person.number = number;

      return person.save().then((updatedPerson) => {
        res.json(updatedPerson);
      });
    })
    .catch((error) => next(error));
});

app.get("/info", (req, res) => {
  Person.countDocuments({}).then((count) => {
    res.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${Date()}</p>
    `);
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
