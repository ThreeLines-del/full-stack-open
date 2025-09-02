import Author from "../models/author.js";
import Book from "../models/book.js";
import { GraphQLError } from "graphql";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { PubSub } from "graphql-subscriptions";
const pubSub = new PubSub();

pubSub.publish("EVENT_ONE", { data: 42 });

const resolvers = {
  Subscription: {
    bookAdded: {
      subscribe: () => pubSub.asyncIterableIterator(["BOOK_ADDED"]),
    },
  },

  Query: {
    authorCount: async () => await Author.collection.countDocuments(),
    bookCount: async () => await Book.collection.countDocuments(),
    allBooks: async (root, args) => {
      // console.log("Book.find called with args:", args);
      const query = {};

      if (args.genre) query.genres = args.genre;

      if (args.author) {
        const authorDoc = await Author.findOne({ name: args.author });
        query.author = authorDoc._id;
      }

      return Book.find(query).populate("author");
    },
    allAuthors: async () => await Author.find({}),

    me(root, args, context) {
      return context.currentUser;
    },

    async recommendedBooks(root, args, context) {
      const currentUser = context.currentUser;
      return await Book.find({ genres: currentUser.favoriteGenre }).populate(
        "author"
      );
    },
  },

  Author: {
    bookCount: async (root, args, context) => {
      const authorId = root.id;
      return context.loaders.bookCountLoader.load(authorId);
    },
  },

  // Book: {
  //   author: async (root) => {
  //     return await Author.findById(root.author);
  //   },
  // },

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
          const savedBook = await book.populate("author");

          pubSub.publish("BOOK_ADDED", { bookAdded: savedBook });

          return {
            title: savedBook.title,
            author: savedBook.author,
          };
        }

        const newBook = {
          ...args,
          author: authorFound._id,
        };
        const book = new Book(newBook);
        await book.save();
        const savedBook = await book.populate("author");

        pubSub.publish("BOOK_ADDED", { bookAdded: savedBook });

        return {
          title: savedBook.title,
          author: savedBook.author,
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

export default resolvers;
