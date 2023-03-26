import { Schema, model } from "mongoose";

const FormSchema = Schema(
  {
    formTitle: { type: String },
    formType: { type: String },
    formLink: { type: String },
    formStatus: {
      type: String,
      enum: ["IN_PROCESS", "UNDER_REVIEW", "ACCEPTED", "REJECTED", "CANCELED"],
      default: "IN_PROCESS",
    },
    description: { type: String },
    responses: [{ type: Object }],
    questions: [{ type: Object }],
    adminId: { type: Schema.Types.ObjectId },
    surveyorEmail: { type: String },
  },
  { timestamps: true }
);
export default model("Forms", FormSchema, "Forms");
