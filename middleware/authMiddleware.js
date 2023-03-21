import { AuthenticationError } from "apollo-server";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();
export function authMiddleware(resolve, parent, args, context, info) {
  if (context.req && context.req.headers.authorization) {
    const token = context.req.headers.authorization.split("Bearer ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, process.env.JWT_SECRET);

        context.currentUser = user;
      } catch (err) {
        throw new AuthenticationError("Invalid/Expired token");
      }
    } else {
      throw new Error("Authentication token must be 'Bearer [token]'");
    }
  }
  return resolve(parent, args, context, info);
}
