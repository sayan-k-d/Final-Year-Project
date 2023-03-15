import { model, Schema } from "mongoose";

const AdminSchema = Schema(
  {
    surveyorId: { type: Schema.Types.ObjectId },
    formId: { type: Schema.Types.ObjectId },
    image: { type: String },
    organization: {
      organizationName: { type: String },
      organizationId: { type: String },
    },
    profession: { type: String },
    userId: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);
export default model("Admin", AdminSchema, "Admin");
