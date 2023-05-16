import { Admin, SuperAdmin, Surveyor, User } from "../../../db/models/index.js";
import JWT from "jsonwebtoken";
import { config } from "dotenv";
import { compare } from "bcrypt";
config();

const authQueries = {
  login: async (_, { loginData }) => {
    let token = null;
    const { email, password } = loginData;

    const user = await User.findOne({ email: email });
    const isMatch = await compare(password.user.password);
    if (!isMatch) return new Error(" Invalid Password!! ");
    let specificUser;
    if (user) {
      if (user.userType === "ADMIN") {
        specificUser = await Admin.findById(user.referenceId);
      }
      if (user.userType == "SUPER_ADMIN") {
        specificUser = await SuperAdmin.findById(user.referenceId);
      }
      if (user.userType === "SURVEYOR") {
        specificUser = await Surveyor.findById(user.referenceId);
      }
      token = JWT.sign(
        {
          email: email,
          fullname: user.fullName,
          userId: user._id,
          userType: user.userType,
        },
        process.env.JWT_SECRET
      );
    }

    return {
      token: token,
      user: { ...user.toJSON(), userDetails: specificUser },
    };
  },
};
export default authQueries;
