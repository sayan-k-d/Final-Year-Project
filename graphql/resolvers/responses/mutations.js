import { AnonymousUser, Forms, Response } from "../../../db/models/index.js";

const responseMutations = {
  createResponse: async (_, { formId, responseData }, { currentUser }) => {
    if (currentUser) {
      responseData.userId = currentUser.userId;
      let isFormExist = await Response.findOne({ formId: formId });
      if (isFormExist) {
        await Forms.findByIdAndUpdate(
          formId,
          {
            $push: {
              surveyorId: currentUser.userId,
            },
          },
          { new: true }
        );
        return await Response.findOneAndUpdate(
          { formId: formId },
          { $push: { responses: responseData } },
          { new: true }
        );
      } else {
        const newResponse = await new Response({
          formId: formId,
          responses: [responseData],
        }).save();
        await Forms.findByIdAndUpdate(
          formId,
          {
            $push: {
              responses: newResponse._id,
              surveyorId: currentUser.userId,
            },
          },
          { new: true }
        );
        return newResponse;
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
      await Forms.findByIdAndUpdate(
        formId,
        {
          $push: {
            surveyorId: anonymousResponseData.userId,
          },
        },
        { new: true }
      );
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
      await Forms.findByIdAndUpdate(
        formId,
        {
          $push: {
            responses: newResponse._id,
            surveyorId: anonymousResponseData.userId,
          },
        },
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
    }
  },
};
export default responseMutations;
