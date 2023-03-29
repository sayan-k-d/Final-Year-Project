import { Forms } from "../../../db/models/index.js";

const formMutations = {
  createForm: async (_, { formsData }, { currentUser }) => {
    if (currentUser) {
      formsData.adminId = currentUser.userId;
      console.log(formsData);
      let newForm = await new Forms(formsData).save();
      return newForm;
    }
  },
  updateForm: async (_, { id, updateFormDataInput }, { currentUser }) => {
    if (currentUser) {
      const updateForm = Forms.findByIdAndUpdate(id, {
        ...updateFormDataInput,
        $push: { questions: updateFormDataInput },
      });
      return updateForm;
    } else {
      return "Unauthorised";
    }
  },
};
export default formMutations;
