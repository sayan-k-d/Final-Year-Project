import { User } from "../../../db/models/index.js";
import JWT from "jsonwebtoken";
import { config } from "dotenv";
config();

const authQueries = {
  login: async (_, { loginData }) => {
    let token = null;
    const { email, password } = loginData;
    const user = await User.findOne({ email: email, password: password });
    if (user) {
      token = JWT.sign(
        { email: email, fullname: user.fullName, userId: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
    }
    // console.log(token);
    return {
      token: token,
      user: user.toJSON(),
    };
  },
};
export default authQueries;
