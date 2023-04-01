import { Schema, model } from "mongoose";

const SurveyorSchema = Schema(
  {
    formReferance: [
      {
        adminId: { type: Schema.Types.ObjectId },
        formId: { type: Schema.Types.ObjectId },
      },
    ],
    userId: { type: Schema.Types.ObjectId },
    organization: {
      organizationName: { type: String },
      organizationId: { type: String },
    },
    profession: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);
export default model("Surveyor", SurveyorSchema, "Surveyor");
