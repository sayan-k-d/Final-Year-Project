import { Admin, Surveyor, User } from "../../../db/models/index.js";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";
import { config } from "dotenv";

config();
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
  resetPassword: async (_, { email }) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        console.log(err);
      }
      const resetToken = buffer.toString("hex");
      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            return null;
          }
          user.resetToken = resetToken;
          user.resetTokenExpire = Date.now() + 3600000;
          return user.save();
        })
        .then((result) => {
          let mailOptions = {
            to: email,
            from: "sayan.studenttiu2000@gmail.com",
            subject: "Password Reset",
            html: `
            <p>Hey,</p>
            <p>Looks like you forgot your password. Dont worry, here's the link to reset it : <strong><a href="http://localhost:3000/forgot-password/${resetToken}">Reset Your Password</a></strong></p>
          `,
          };
          sgMail
            .send(mailOptions)
            .then((info) => {
              return "Email sent";
            })
            .catch((error) => {
              return error;
            });
        })
        .catch((err) => {
          return err;
        });
    });
  },
};
export default authMutations;
