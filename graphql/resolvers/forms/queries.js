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

          specificUser = await Admin.findById(userData.referenceId);

          userData.userDetails = specificUser;
          return userData;
        },
        surveyorDetails: async () => {
          const userData = await User.findById(_doc.surveyorId);
          let specificUser = await Surveyor.findById(userData.referenceId);
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
