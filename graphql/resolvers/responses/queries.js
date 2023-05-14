import { Forms, Response, User } from "../../../db/models/index.js";
import JWT from "jsonwebtoken";
import { config } from "dotenv";
config();
const { sign } = JWT;
const responseQueries = {
  getQuestionResponses: async (_, { id }, { currentUser }) => {
    if (currentUser) {
      const findResponse = await Response.findOne({ formId: id });
      const findFrom = await Forms.findById(id);
      findResponse.responses.map((response) => {
        for (let i = 0; i < findResponse.responses.length; i++) {
          response.response.map((responseData) => {
            // findFrom.questions.map((question) => {
            //   if (responseData.questionId === question.id) {
            //     console.log(question.questionTitle);
            //   }
            // });

            console.log(responseData.responseText);
          });
        }
      });
    }
  },
};
export default responseQueries;
