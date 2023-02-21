import { User } from "../../../db/models/index.js";
import JWT from "jsonwebtoken";
import { config } from "dotenv";
config();
const { sign } = JWT;
const authQueries = {
  login: async (_, { loginData }) => {
    let token = null;
    const { email, password } = loginData;
    const user = await User.findOne({ email: email, password: password });
    if (user) {
      token = sign({ email, password }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
    }
    console.log(token);
    return { ...user.toJSON(), token: token };
  },
};
export default authQueries;
