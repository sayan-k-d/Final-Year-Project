import { Schema, model } from "mongoose";

const UserSchema = Schema(
  {
    fullName: { type: String },
    email: { type: String, unique: true },
    phone: { type: String },
    address: {
      city: { type: String },
      country: { type: String },
      state: { type: String },
    },
    date_of_birth: { type: String },
    referenceId: { type: Schema.Types.ObjectId },
    userType: {
      type: String,
      enum: ["SURVEYOR", "ADMIN", "SUPER_ADMIN"],
      default: "SURVEYOR",
    },
    password: { type: String },
  },
  { timestamps: true }
);

export default model("User", UserSchema);
