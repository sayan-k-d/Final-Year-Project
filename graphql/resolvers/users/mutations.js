import { Admin, SuperAdmin, Surveyor, User } from "../../../db/models/index.js";

const userMutations = {
  createUser: async (_, { userDataInput }) => {
    const newUser = await new User(userDataInput).save();
    userDataInput.userId = newUser._id;
    if (newUser.userType === "ADMIN") {
      const newAdmin = await new Admin(userDataInput).save();
      await User.findByIdAndUpdate(newUser._id, { referenceId: newAdmin._id });
    }
    if (newUser.userType == "SUPER_ADMIN") {
      const newSuperAdmin = await new SuperAdmin(userDataInput).save();
      await User.findByIdAndUpdate(newUser._id, {
        referenceId: newSuperAdmin._id,
      });
    }
    if (newUser.userType === "SURVEYOR") {
      const newSurveyor = await new Surveyor(userDataInput).save();
      await User.findByIdAndUpdate(newUser._id, {
        referenceId: newSurveyor._id,
      });
    }
    return newUser;
  },
};
export default userMutations;
