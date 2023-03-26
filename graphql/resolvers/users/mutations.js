import { AuthenticationError } from "apollo-server";
import { Admin, SuperAdmin, Surveyor, User } from "../../../db/models/index.js";

const userMutations = {
  createUser: async (_, { userDataInput }) => {
    const newUser = await new User(userDataInput).save();
    userDataInput.userId = newUser._id;
    let specificUser;
    if (newUser.userType === "ADMIN") {
      specificUser = await new Admin(userDataInput).save();
    }
    if (newUser.userType == "SUPER_ADMIN") {
      specificUser = await new SuperAdmin(userDataInput).save();
    }
    if (newUser.userType === "SURVEYOR") {
      specificUser = await new Surveyor(userDataInput).save();
    }
    await User.findByIdAndUpdate(newUser._id, {
      referenceId: specificUser._id,
    });
    return { ...newUser.toJSON(), userDetails: specificUser };
  },

  updateUser: async (_, { id, updateUserDataInput }, { currentUser }) => {
    if (currentUser) {
      if (updateUserDataInput.userType) {
        const isSuperAdmin = await User.findById(currentUser.userId);
        if (isSuperAdmin.userType !== "SUPER_ADMIN") {
          return {
            ...isSuperAdmin.toJSON(),
            userDetails: async () => {
              let specificUser;
              if (isSuperAdmin.userType === "ADMIN") {
                specificUser = await Admin.findById(isSuperAdmin.referenceId);
              } else if (isSuperAdmin.userType === "SURVEYOR") {
                specificUser = await Surveyor.findById(
                  isSuperAdmin.referenceId
                );
              }
              return specificUser;
            },
          };
        }
      }
      const updateUser = await User.findByIdAndUpdate(id, updateUserDataInput);
      // console.log(updateUser);
      let updateSpecificUser, newSpecificUser;
      if (updateUser.userType === "ADMIN") {
        updateSpecificUser = await Admin.findByIdAndUpdate(
          updateUser.referenceId,
          updateUserDataInput,
          { new: true }
        );
        if (updateUserDataInput.userType != updateUser.userType) {
          await Admin.findByIdAndDelete(updateUser.referenceId);
        }
      }
      if (updateUser.userType === "SUPER_ADMIN") {
        updateSpecificUser = await SuperAdmin.findByIdAndUpdate(
          updateUser.referenceId,
          updateUserDataInput,
          { new: true }
        );

        if (
          updateUserDataInput.userType != null &&
          updateUserDataInput.userType != updateUser.userType
        ) {
          await SuperAdmin.findByIdAndDelete(updateUser.referenceId);
        }
      }
      if (updateUser.userType === "SURVEYOR") {
        updateSpecificUser = await Surveyor.findByIdAndUpdate(
          updateUser.referenceId,
          updateUserDataInput,
          { new: true }
        );
        if (updateUserDataInput.userType != updateUser.userType) {
          await Surveyor.findByIdAndDelete(updateUser.referenceId);
        }
      }
      if (updateUserDataInput.userType != updateUser.userType) {
        if (updateUserDataInput.userType === "ADMIN") {
          newSpecificUser = await new Admin({
            ...updateSpecificUser.toJSON(),
            userId: updateSpecificUser.userId,
          }).save();
        } else if (updateUserDataInput.userType == "SUPER_ADMIN") {
          newSpecificUser = await new SuperAdmin({
            ...updateSpecificUser.toJSON(),
            userId: updateSpecificUser.userId,
          }).save();
        } else if (updateUserDataInput.userType === "SURVEYOR") {
          newSpecificUser = await new Surveyor({
            ...updateSpecificUser.toJSON(),
            userId: updateSpecificUser.userId,
          }).save();
        }
        if (newSpecificUser)
          await User.findByIdAndUpdate(id, {
            referenceId: newSpecificUser._id,
          });
      }
      const getUser = await User.findById(id);
      return newSpecificUser
        ? { ...getUser.toJSON(), userDetails: newSpecificUser }
        : { ...getUser.toJSON(), userDetails: updateSpecificUser };
    } else {
      return new AuthenticationError();
    }
  },

  deleteUser: async (_, { id }) => {
    const deletedUser = await User.findByIdAndDelete(id);
    if (deletedUser.userType === "ADMIN") {
      await Admin.findByIdAndDelete(deletedUser.referenceId);
    }
    if (deletedUser.userType == "SUPER_ADMIN") {
      await SuperAdmin.findByIdAndDelete(deletedUser.referenceId);
    }
    if (deletedUser.userType === "SURVEYOR") {
      await Surveyor.findByIdAndDelete(deletedUser.referenceId);
    }
    return "Record Deleted Succssfully.";
  },
};
export default userMutations;
