import { Schema, model } from "mongoose";

const SurveyorFormSchema = Schema(
  {
    formTitle: { type: String },
    description: { type: String },
    formType: { type: String },
    questions: [{ type: Object }],
    assignedAdmin: { type: String },
    requestedSurveyor: {
      fullName: { type: String },
      email: { type: String },
      phone: { type: String },
    },
  },
  { timestamps: true }
);
export default model("SurveyorForms", SurveyorFormSchema, "SurveyorForms");
