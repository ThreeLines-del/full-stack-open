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

    type Subscription {
        bookAdded: Book!
    }
`;

export default typeDefs;
