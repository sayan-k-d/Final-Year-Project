import { AuthenticationError } from "apollo-server";
import { Admin, SuperAdmin, Surveyor, User } from "../../../db/models/index.js";

const adminQueries = {
  getAllUsers: async (_, { UserType }, { currentUser }) => {
    if (currentUser) {
      const allUsers = await User.find({ userType: UserType });
      return allUsers.map(async ({ _doc }) => ({
        ..._doc,
        userDetails: async () => {
          let specificUser;
          if (_doc.userType === "ADMIN") {
            specificUser = await Admin.findById(_doc.referenceId);
          }
          if (_doc.userType == "SUPER_ADMIN") {
            specificUser = await SuperAdmin.findById(_doc.referenceId);
          }
          if (_doc.userType === "SURVEYOR") {
            specificUser = await Surveyor.findById(_doc.referenceId);
          }
          return specificUser;
        },
      }));
    } else {
      return new AuthenticationError();
    }
  },
  getUserById: async (_, { id }, { currentUser }) => {
    if (currentUser) {
      const user = await User.findById(id);
      let specificUser;
      if (user.userType === "ADMIN") {
        specificUser = await Admin.findById(user.referenceId);
      }
      if (user.userType == "SUPER_ADMIN") {
        specificUser = await SuperAdmin.findById(user.referenceId);
      }
      if (user.userType === "SURVEYOR") {
        specificUser = await Surveyor.findById(user.referenceId);
      }
      user.userDetails = specificUser;
      return user;
    } else {
      return new AuthenticationError();
    }
  },
};
export default adminQueries;
