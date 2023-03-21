import { ApolloServer, gql } from "apollo-server";
import mongoose from "mongoose";
import schema from "./graphql/schema.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import { applyMiddleware } from "graphql-middleware";
import { config } from "dotenv";
config();
const MONGODB_URI = process.env.MONGO_URI;

const server = new ApolloServer({
  schema: applyMiddleware(schema, authMiddleware),
  context: ({ req }) => ({ req }),
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    server.listen().then(({ url }) => {
      console.log("Server Listens to : ", url);
    });
  })
  .catch((err) => {
    console.log(err);
  });
