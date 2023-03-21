import { Admin, SuperAdmin, Surveyor, User } from "../../../db/models/index.js";

const adminQueries = {
  getAllUsers: async () => {
    const allAdmins = await User.find({ userType: "ADMIN" });
    return allAdmins.map(async ({ _doc }) => ({
      ..._doc,
      adminDetails: await Admin.findById(_doc.referenceId),
    }));
  },
  getUserById: async (_, { id }) => {
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
  },
};
export default adminQueries;
