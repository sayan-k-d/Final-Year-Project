import { Schema, model } from "mongoose";

const SurveyorFormSchema = Schema(
  {
    formTitle: { type: String },
    description: { type: String },
    formType: { type: String },
    questions: [{ type: Object }],
    assignedAdmin: { type: String },
    requestedSurveyor: { type: String },
  },
  { timestamps: true }
);
export default model("SurveyorForms", SurveyorFormSchema, "SurveyorForms");
