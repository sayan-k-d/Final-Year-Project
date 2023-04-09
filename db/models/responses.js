import { model, Schema } from "mongoose";

const ResponseSchema = Schema(
  {
    formId: { type: Schema.Types.ObjectId },
    responses: [
      {
        userId: { type: Schema.Types.ObjectId },
        response: [
          {
            questionId: { type: String },
            responseText: { type: String },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);
export default model("Response", ResponseSchema, "Response");
