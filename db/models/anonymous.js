import { Schema, model } from "mongoose";

const AnonymousUserSchema = Schema(
  {
    fullName: { type: String },
    email: { type: String, unique: true },
  },
  { timestamps: true }
);

export default model("AnonymousUser", AnonymousUserSchema, "AnonymousUser");
