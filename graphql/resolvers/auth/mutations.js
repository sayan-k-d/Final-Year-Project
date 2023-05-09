import { Admin, Surveyor, User } from "../../../db/models/index.js";

const authMutations = {
  registerUser: async (_, { registrationData }) => {
    const newUser = await new User(registrationData).save();
    registrationData.userId = newUser._id;
    if (newUser.userType === "ADMIN") {
      const newAdmin = await new Admin(registrationData).save();
      await User.findByIdAndUpdate(newUser._id, { referenceId: newAdmin._id });
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
export default authMutations;
