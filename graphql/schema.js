import gql from "graphql-tag";
import { dirname, join } from "path";
import { readdirSync, readFileSync } from "fs";
import url from "url";

import { buildSubgraphSchema } from "@apollo/subgraph";
import resolvers from "./resolvers/index.js";

const filename = url.fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(filename);

const gqlFiles = readdirSync(join(__dirname, "./typedefs"));

let typeDefs = "";

gqlFiles.forEach((file) => {
  typeDefs += readFileSync(join(__dirname, "./typedefs", file), {
    encoding: "utf8",
  });
});

typeDefs = gql`
  ${typeDefs}
`;

const schema = buildSubgraphSchema({
  typeDefs,
  resolvers,
});

export default schema;
