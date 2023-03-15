import { AnonymousUser, Response } from "../../../db/models/index.js";

const responseMutations = {
  createResponse: async (_, { formId, responseData }, { currentUser }) => {
    if (currentUser) {
      responseData.userId = currentUser.userId;
      let isFormExist = await Response.findOne({ formId: formId });
      if (isFormExist) {
        return await Response.findOneAndUpdate(
          { formId: formId },
          { $push: { responses: responseData } },
          { new: true }
        );
      } else {
        const newResponse = new Response({
          formId: formId,
          responses: [responseData],
        });
        return await newResponse.save();
      }
    } else {
      return await Response.findOne({ formId: formId });
    }
  },

  anonymousResponses: async (_, { formId, anonymousResponseData }) => {
    let isFormExist = await Response.findOne({ formId: formId });
    let isUserExist = await AnonymousUser.findOne({
      email: anonymousResponseData.email,
    });
    let newAnonymousUser;
    if (!isUserExist) {
      newAnonymousUser = await new AnonymousUser(anonymousResponseData).save();
      anonymousResponseData.userId = newAnonymousUser._id;
    } else {
      anonymousResponseData.userId = isUserExist._id;
    }
    if (isFormExist) {
      const updateResponse = await Response.findOneAndUpdate(
        { formId: formId },
        { $push: { responses: anonymousResponseData } },
        { new: true }
      );
      return newAnonymousUser
        ? {
            responses: anonymousResponseData.response,
            formId: formId,
            anonymousUser: newAnonymousUser,
          }
        : {
            responses: anonymousResponseData.response,
            formId: formId,
            anonymousUser: isUserExist,
          };
    } else {
      const newResponse = new Response({
        formId: formId,
        responses: [anonymousResponseData],
      });
      await newResponse.save();
      return newAnonymousUser
        ? {
            responses: anonymousResponseData.response,
            formId: formId,
            anonymousUser: newAnonymousUser,
          }
        : {
            responses: anonymousResponseData.response,
            formId: formId,
            anonymousUser: isUserExist,
          };
    }
  },
};
export default responseMutations;
