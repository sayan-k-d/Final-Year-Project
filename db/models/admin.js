import { model, Schema } from "mongoose";

const AdminSchema = Schema(
  {
    surveyorId: { type: Schema.Types.ObjectId },
    formId: { type: Schema.Types.ObjectId },
    image: { type: String },
    company: { companyName: { type: String }, employeeId: { type: String } },

    userId: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);
export default model("Admin", AdminSchema, "Admin");
