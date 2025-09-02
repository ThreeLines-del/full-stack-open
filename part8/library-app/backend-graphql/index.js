import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import cors from "cors";
import http from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "./models/user.js";

import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";

dotenv.config();

import typeDefs from "./graphql/schema.js";
import resolvers from "./graphql/resolvers.js";
import createLoaders from "./context.js";

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("connected to mongoDB");
});

mongoose.set("debug", true);

const app = express();
const httpServer = http.createServer(app);

// Create schema for both HTTP and WS
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create WebSocket server
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

const serverCleanup = useServer(
  {
    schema,
    context: async (ctx) => {
      let currentUser = null;
      const auth = ctx.connectionParams?.authorization || null;
      if (auth?.startsWith("Bearer ")) {
        try {
          const decodedToken = jwt.verify(
            auth.substring(7),
            process.env.JWT_SECRET
          );
          currentUser = await User.findById(decodedToken.id);
        } catch (err) {
          console.warn("Invalid token in WS connection:", err.message);
        }
      }
      return {
        currentUser,
        loaders: createLoaders(),
      };
    },
  },
  wsServer
);

// Create Apollo Server for HTTP
const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
  introspection: true,
});

(async () => {
  await server.start();

  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        let currentUser = null;
        const auth = req.headers.authorization || null;
        if (auth?.startsWith("Bearer ")) {
          try {
            const decodedToken = jwt.verify(
              auth.substring(7),
              process.env.JWT_SECRET
            );
            currentUser = await User.findById(decodedToken.id);
          } catch (err) {
            console.warn("Invalid token:", err.message);
          }
        }
        return {
          currentUser,
          loaders: createLoaders(),
        };
      },
    })
  );

  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Query endpoint ready at http://localhost:${PORT}/graphql`);
    console.log(
      `🚀 Subscription endpoint ready at ws://localhost:${PORT}/graphql`
    );
  });
})();
