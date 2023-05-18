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
              respondentId: currentUser.userId,
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
            responses: newResponse._id,
            formStatus: "ACCEPTED",
            $push: {
              respondentId: currentUser.userId,
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
    // let isUserExist = await AnonymousUser.findOne({
    //   email: anonymousResponseData.email,
    // });
    // let newAnonymousUser;
    // if (!isUserExist) {
    //   newAnonymousUser = await new AnonymousUser(anonymousResponseData).save();
    //   anonymousResponseData.userId = newAnonymousUser._id;
    // } else {
    //   anonymousResponseData.userId = isUserExist._id;
    // }
    // await Forms.findByIdAndUpdate(
    //   formId,
    //   {
    //     $push: {
    //       respondentId: anonymousResponseData.userId,
    //     },
    //   },
    //   { new: true }
    // );
    if (isFormExist) {
      const updateResponse = await Response.findOneAndUpdate(
        { formId: formId },
        { $push: { responses: anonymousResponseData } },
        { new: true }
      );
      return {
        responses: anonymousResponseData.response,
        formId: formId,
        // anonymousUser: newAnonymousUser,
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
          responses: newResponse._id,
          formStatus: "ACCEPTED",
        },
        { new: true }
      );
      return {
        responses: anonymousResponseData.response,
        formId: formId,
        // anonymousUser: newAnonymousUser,
      };
    }
  },
};
export default responseMutations;
