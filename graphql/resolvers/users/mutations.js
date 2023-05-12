import { AuthenticationError } from "apollo-server";
import sgMail from "@sendgrid/mail";
import { Admin, SuperAdmin, Surveyor, User } from "../../../db/models/index.js";
import { config } from "dotenv";
config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
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

    let mailOptions = {
      to: userDataInput.email,
      from: "sayan.studenttiu2000@gmail.com",
      subject: "Welcome to SurveyHub",
      html: `
      <p>Hey there, <strong>${userDataInput.fullName}</strong></p>
      <p>Welcome to SurveyHub! Please find below the login credentials to your account.<p>

      <p><b>Email Id:</b> ${userDataInput.email}</p>
      <p><b>Password:</b> ${userDataInput.password}</p>

      <p style="color: red;"><i>**Please ensure you do not share this password with anyone for keeping your account safe.</i></p>`,
    };
    sgMail
      .send(mailOptions)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
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
        } else {
          const updateUser = await User.findByIdAndUpdate(
            id,
            updateUserDataInput
          );
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
            if (newSpecificUser) {
              const updatedUserData = await User.findByIdAndUpdate(
                id,
                {
                  referenceId: newSpecificUser._id,
                },
                { new: true }
              );
            }
          }
          const getUser = await User.findById(id);
          return newSpecificUser
            ? { ...getUser.toJSON(), userDetails: newSpecificUser }
            : { ...getUser.toJSON(), userDetails: updateSpecificUser };
        }
      } else {
        //---------------
        const updateUser = await User.findByIdAndUpdate(
          id,
          updateUserDataInput
        );
        let updateSpecificUser;
        if (updateUser.userType === "ADMIN") {
          updateSpecificUser = await Admin.findByIdAndUpdate(
            updateUser.referenceId,
            updateUserDataInput,
            { new: true }
          );
        }
        if (updateUser.userType === "SUPER_ADMIN") {
          updateSpecificUser = await SuperAdmin.findByIdAndUpdate(
            updateUser.referenceId,
            updateUserDataInput,
            { new: true }
          );
        }
        if (updateUser.userType === "SURVEYOR") {
          updateSpecificUser = await Surveyor.findByIdAndUpdate(
            updateUser.referenceId,
            updateUserDataInput,
            { new: true }
          );
        }
        const getUser = await User.findById(id);
        return { ...getUser.toJSON(), userDetails: updateSpecificUser };
      }
    } else {
      return new AuthenticationError();
    }
  },

  updateUserPassword: async (_, { resetToken, newPassword }) => {
    try {
      let user = await User.findOne({
        resetToken: resetToken,
        resetTokenExpire: { $gt: Date.now() },
      });
      if (!user) {
        return null;
      }

      (user.password = newPassword),
        (user.resetToken = undefined),
        (user.resetTokenExpire = undefined);
      return user.save();
    } catch (err) {
      return err;
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
