import { Admin, SuperAdmin, Surveyor, User } from "../../../db/models/index.js";
import JWT from "jsonwebtoken";
import { config } from "dotenv";
config();

const authQueries = {
  login: async (_, { loginData }) => {
    let token = null;
    const { email, password } = loginData;
    const user = await User.findOne({ email: email, password: password });
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
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
    }

    return {
      token: token,
      user: { ...user.toJSON(), userDetails: specificUser },
    };
  },
};
export default authQueries;
