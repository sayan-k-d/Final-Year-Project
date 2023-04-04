import { Admin, Forms, Surveyor, User } from "../../../db/models/index.js";

const formMutations = {
  createForm: async (_, { formsData }, { currentUser }) => {
    // console.log(currentUser);
    if (currentUser) {
      formsData.adminId = currentUser.userId;
      let newForm = await new Forms(formsData).save();
      const getAdmin = await User.findById(currentUser.userId);
      const getSurveyor = await User.findById(formsData.surveyorId);
      await Admin.findByIdAndUpdate(getAdmin.referenceId, {
        $push: {
          formReferance: {
            formId: newForm._id,
            surveyorId: formsData.surveyorId,
          },
        },
      }),
        await Surveyor.findByIdAndUpdate(getSurveyor.referenceId, {
          $push: {
            formReferance: {
              adminId: currentUser.userId,
              formId: newForm._id,
            },
          },
        });
      return newForm;
    }
  },
  updateForm: async (_, { id, updateFormDataInput }, { currentUser }) => {
    if (currentUser) {
      const updateForm = Forms.findByIdAndUpdate(
        id,
        {
          ...updateFormDataInput,
          $push: { questions: updateFormDataInput },
        },
        { new: true }
      );
      return updateForm;
    } else {
      return "Unauthorised";
    }
  },
};
export default formMutations;
