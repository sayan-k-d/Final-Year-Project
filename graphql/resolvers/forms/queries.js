import {
  Admin,
  Forms,
  Surveyor,
  User,
  Response,
  SurveyorForms,
} from "../../../db/models/index.js";
import { config } from "dotenv";
import { AuthenticationError } from "apollo-server";
config();

const formQueries = {
  getAllForms: async (_, __, { currentUser }) => {
    if (currentUser) {
      let allForms;
      if (currentUser.userType === "SUPER_ADMIN") {
        allForms = await Forms.find();
      } else if (currentUser.userType === "ADMIN") {
        allForms = await Forms.find({ adminId: currentUser.userId });
      } else if (currentUser.userType === "SURVEYOR") {
        allForms = await Forms.find({ surveyorId: currentUser.userId });
      }
      // console.log(allForms);
      return allForms.map(async ({ _doc }) => ({
        ..._doc,
        adminDetails: async () => {
          const userData = await User.findById(_doc.adminId);
          if (userData) {
            let specificUser = await Admin.findById(userData.referenceId);
            userData.userDetails = specificUser;
            return userData;
          } else {
            return null;
          }
        },
        surveyorDetails: async () => {
          const userData = await User.findById(_doc.surveyorId);
          if (userData) {
            let specificUser = await Surveyor.findById(userData.referenceId);
            userData.userDetails = specificUser;
            return userData;
          } else {
            return null;
          }
        },
      }));
    } else {
      return new AuthenticationError();
    }
  },
  getFormByIdA: async (_, { id }, { currentUser }) => {
    if (currentUser) {
      let getForm = await Forms.findById(id);
      return {
        ...getForm.toJSON(),
        adminDetails: async () => {
          const userData = await User.findById(getForm.adminId);

          if (userData) {
            let specificUser = await Admin.findById(userData.referenceId);

            userData.userDetails = specificUser;
            return userData;
          } else {
            return null;
          }
        },
        surveyorDetails: async () => {
          const userData = await User.findById(getForm.surveyorId);
          if (userData) {
            let specificUser = await Surveyor.findById(userData.referenceId);
            userData.userDetails = specificUser;
            return userData;
          } else {
            return null;
          }
        },
        responseDetails: async () => {
          if (getForm.responses) {
            const responseData = await Response.findById(getForm.responses);
            return responseData;
          } else {
            return null;
          }
        },
      };
    } else {
      return new AuthenticationError();
    }
  },
  getFormByIdQ: async (_, { id }) => {
    let getForm = await Forms.findById(id);
    return getForm;
  },
  getRequestedForms: async (_, __, { currentUser }) => {
    if (currentUser) {
      if (currentUser.userType === "SUPER_ADMIN") {
        return await SurveyorForms.find();
      } else {
        return new Error("Only Super Admin Has Access to This");
      }
    } else {
      return new AuthenticationError();
    }
  },
};
export default formQueries;
