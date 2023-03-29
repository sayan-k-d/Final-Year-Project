import { Admin, Forms, Surveyor, User } from "../../../db/models/index.js";
import JWT from "jsonwebtoken";
import { config } from "dotenv";
import { AuthenticationError } from "apollo-server";
config();

const formQueries = {
  getAllForms: async (_, __, { currentUser }) => {
    if (currentUser) {
      const allForms = await Forms.find();
      return allForms.map(async ({ _doc }) => ({
        ..._doc,
        adminDetails: async () => {
          const userData = await User.findById(_doc.adminId);
          // console.log(userData);
          let specificUser;
          if (userData.userType === "ADMIN") {
            specificUser = await Admin.findById(userData.referenceId);
          }
          if (userData.userType == "SUPER_ADMIN") {
            specificUser = await SuperAdmin.findById(userData.referenceId);
          }
          if (userData.userType === "SURVEYOR") {
            specificUser = await Surveyor.findById(userData.referenceId);
          }

          userData.userDetails = specificUser;
          return userData;
        },
      }));
    } else {
      return new AuthenticationError();
    }
  },
};
export default formQueries;
