import { userMutations, userQueries } from "./users/index.js";
import { authMutations, authQueries } from "./auth/index.js";
import { responseMutations, responseQueries } from "./responses/index.js";
import { formMutations, formQueries } from "./forms/index.js";

const resolvers = {
  Query: {
    ...userQueries,
    ...authQueries,
    ...responseQueries,
    ...formQueries,
  },
  Mutation: {
    ...userMutations,
    ...authMutations,
    ...responseMutations,
    ...formMutations,
  },
};

export default resolvers;
