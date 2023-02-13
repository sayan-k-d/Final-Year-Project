import { verify } from "jsonwebtoken";
import { config } from "dotenv";
config();
export default (context) => {
  if (context.req && context.req.headers.authorization) {
    const token = context.req.headers.authorization.split("Bearer ")[1];
    verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      context.user = decodedToken;
    });
  }

  return context;
};
