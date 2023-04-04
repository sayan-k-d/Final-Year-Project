import { Admin, Forms, Surveyor, User } from "../../../db/models/index.js";
import JWT from "jsonwebtoken";
import { config } from "dotenv";
import { AuthenticationError } from "apollo-server";
config();

const formQueries = {
  getAllForms: async (_, __, { currentUser }) => {
    if (currentUser) {
      let allForms;
      if (currentUser.userType === "SUPER_ADMIN") {
        allForms = await Forms.find();
      } else if (currentUser.userType === "ADMIN") {
        allForms = await Forms.find({ adminId: currentUser.userId });
      } else if (currentUser.userType === "SURVEYOR") {
        allForms = await Forms.find({ surveyorId: currentUser.userId });
      }
      // console.log(allForms);
      return allForms.map(async ({ _doc }) => ({
        ..._doc,
        adminDetails: async () => {
          const userData = await User.findById(_doc.adminId);

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
