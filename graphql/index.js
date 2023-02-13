import { ApolloServer } from "@apollo/server";
import { applyMiddleware } from "graphql-middleware";
import schema from "./schema.js";
import contextMiddleware from "../middleware/contextMiddleware.js";

const apolloServer = new ApolloServer({
  schema: applyMiddleware(schema /*contextMiddleware*/),
  // context: contextMiddleware,
});

export default apolloServer;
