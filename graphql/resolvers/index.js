import { userMutations, userQueries } from "./users/index.js";
import { authMutations, authQueries } from "./auth/index.js";
import { responseMutations, responseQueries } from "./responses/index.js";

const resolvers = {
  Query: {
    ...userQueries,
    ...authQueries,
    ...responseQueries,
  },
  Mutation: {
    ...userMutations,
    ...authMutations,
    ...responseMutations,
  },
};

export default resolvers;
