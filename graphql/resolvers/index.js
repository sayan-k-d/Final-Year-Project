import { userMutations, userQueries } from "./users/index.js";
import { authMutations, authQueries } from "./auth/index.js";

const resolvers = {
  Query: {
    ...userQueries,
    ...authQueries,
  },
  Mutation: {
    ...userMutations,
    ...authMutations,
  },
};

export default resolvers;
