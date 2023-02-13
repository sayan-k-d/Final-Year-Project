import { Schema, model } from "mongoose";

const SurveyorSchema = Schema(
  {
    adminId: { type: Schema.Types.ObjectId },
    userId: { type: Schema.Types.ObjectId },
    isCompany: { type: Boolean },
    isCollege: { type: Boolean },
    company: { companyName: { type: String }, employeeId: { type: String } },
    college: { collegeName: { type: String }, collegeId: { type: String } },
    image: { type: String },
   
  },
  { timestamps: true }
);
export default model("Surveyor", SurveyorSchema);
