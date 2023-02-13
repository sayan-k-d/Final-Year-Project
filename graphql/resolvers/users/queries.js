import { Admin, User } from "../../../db/models/index.js";

const adminQueries = {
  getAllAdmins: async () => {
    const allAdmins = await User.find({ userType: "ADMIN" });
    return allAdmins.map(async ({ _doc }) => ({
      ..._doc,
      adminDetails: await Admin.findById(_doc.referenceId),
    }));
  },
};
export default adminQueries;
