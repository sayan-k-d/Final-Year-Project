import { Forms, Response, User } from "../../../db/models/index.js";
import JWT from "jsonwebtoken";
import { config } from "dotenv";
import { AuthenticationError } from "apollo-server";
config();
const { sign } = JWT;
const responseQueries = {
  getQuestionResponses: async (_, { id }, { currentUser }) => {
    if (currentUser) {
      const findFrom = await Forms.findById(id);
      const findResponse = await Response.findById(findFrom.responses);
      let allResponseJson = [];
      findFrom.questions.map((question) => {
        let responseJson = {};
        let corResponse = [];
        responseJson.questionTitle = question.questionTitle;
        findResponse.responses.map((response) => {
          response.response
            .filter((res) => res.questionId === question.id)
            .map((res) => {
              corResponse = [...corResponse, res.responseText];
            });
        });
        responseJson.corResponse = corResponse;
        allResponseJson = [...allResponseJson, responseJson];
      });
      return allResponseJson;
    } else {
      return new AuthenticationError();
    }
  },
};
export default responseQueries;
