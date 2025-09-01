const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Author = require("./models/author");
const Book = require("./models/book");
const { GraphQLError } = require("graphql");
const User = require("./models/user");
const jwt = require("jsonwebtoken");

dotenv.config();
const port = process.env.PORT;
const mongoUri = process.env.MONGODB_URI;

let authors = [
  {
    name: "Robert Martin",
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: "Martin Fowler",
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963,
  },
  {
    name: "Fyodor Dostoevsky",
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821,
  },
  {
    name: "Joshua Kerievsky", // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: "Sandi Metz", // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
];

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conexión con el libro
 */

let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "crime"],
  },
  {
    title: "Demons",
    published: 1872,
    author: "Fyodor Dostoevsky",
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "revolution"],
  },
];

/*
  you can remove the placeholder query once your first one has been implemented 
*/
console.log("connecting to", mongoUri);
mongoose.connect(mongoUri).then(() => {
  console.log("connected to mongoDB");
});

const typeDefs = `
    type User {
        id: ID!,
        username: String!,
        favoriteGenre: String!
    }

    type Token {
        value: String!
    }

    type Author {
        name: String!,
        id: ID!,
        born: Int,
        bookCount: Int!
    }

    type Book {
        title: String!,
        published: Int!,
        author: Author!,
        id: ID!,
        genres: [String]
    }

    type Query {
        authorCount: Int!,
        bookCount: Int!,
        allBooks(author: String, genre: String): [Book!],
        allAuthors: [Author!]!,
        me: User
        recommendedBooks: [Book!]
    }

    type Mutation {
        createUser(username: String!, favoriteGenre: String!): User

        login(username: String!, password: String!): Token

        addBook(
            title: String!,
            author: String!,
            published: Int!,
            genres: [String]
        ): Book

        editAuthor(
            name: String!,
            setBornTo: Int!
        ): Author
    }
`;

const resolvers = {
  Query: {
    authorCount: async () => await Author.collection.countDocuments(),
    bookCount: async () => await Book.collection.countDocuments(),
    allBooks: async (root, args) => {
      const query = {};

      if (args.genre) query.genres = args.genre;

      if (args.author) {
        const authorDoc = await Author.findOne({ name: args.author });
        query.author = authorDoc._id;
      }

      return Book.find(query);
    },
    allAuthors: async () => await Author.find({}),

    me(root, args, context) {
      return context.currentUser;
    },

    async recommendedBooks(root, args, context) {
      const currentUser = context.currentUser;
      return await Book.find({ genres: currentUser.favoriteGenre });
    },
  },

  Author: {
    bookCount: async (root) => {
      const authorId = root.id;
      return await Book.countDocuments({ author: authorId });
    },
  },

  Book: {
    author: async (root) => {
      return await Author.findById(root.author);
    },
  },

  Mutation: {
    async createUser(root, args) {
      try {
        const user = new User({
          username: args.username,
          favoriteGenre: args.favoriteGenre,
        });
        const savedUser = await user.save();

        return savedUser;
      } catch (error) {
        throw new GraphQLError("Creating user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      }
    },

    async login(root, args) {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      const token = jwt.sign(userForToken, process.env.JWT_SECRET);
      return {
        value: token,
      };
    },

    async addBook(root, args, context) {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      try {
        const authorFound = await Author.findOne({ name: args.author });

        if (!authorFound) {
          const author = new Author({ name: args.author });
          await author.save();

          const newBook = {
            ...args,
            author: author._id,
          };
          const book = new Book(newBook);
          await book.save();

          return {
            title: book.title,
            author: book.author,
          };
        }

        const newBook = {
          ...args,
          author: authorFound._id,
        };
        const book = new Book(newBook);
        await book.save();

        return {
          title: book.title,
          author: book.author,
        };
      } catch (error) {
        throw new GraphQLError("Adding book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            error: error,
          },
        });
      }
    },

    async editAuthor(root, args, context) {
      const { name, setBornTo } = args;

      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const author = await Author.findOne({ name: name });
      author.born = setBornTo;

      try {
        await author.save();
      } catch (error) {
        throw new GraphQLError("editing author failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            error: error,
            invalidArgs: name,
          },
        });
      }

      return author;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

startStandaloneServer(server, {
  listen: { port: port },
  context: async ({ req }) => {
    const auth = req?.headers.authorization || null;

    if (auth && auth.startsWith("Bearer ")) {
      try {
        const decodedToken = jwt.verify(
          auth.substring(7),
          process.env.JWT_SECRET
        );
        const currentUser = await User.findById(decodedToken.id);
        return { currentUser };
      } catch (err) {
        console.warn("Invalid token in request:", err.message);
        return {};
      }
    }

    return {};
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
