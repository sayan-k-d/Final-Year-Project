import { User } from "../../../db/models/index.js";
import JWT from "jsonwebtoken";
import { config } from "dotenv";
config();
const { sign } = JWT;
const authQueries = {
  login: async (_, loginData) => {
    const { email, password, userType } = loginData;
    const user = User.findOne({
      email: email,
      password: password,
    });
    const token = sign({ email, userType }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return { ...user.toJSON(), token };
  },
};
export default authQueries;
