import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import graphqlServer from "./graphql/index.js";

const app = express();
const httpServer = http.createServer(app);

await graphqlServer.start();
app.use(
  "/graphql",
  cors(),
  bodyParser.json(),
  expressMiddleware(graphqlServer, {
    context: async ({ req }) => ({
      user: {
        name: req.headers["x-user-name"],
        userId: req.headers["x-user-id"],
        userType: req.headers["x-user-type"],
      },
    }),
  })
);

export default httpServer;
