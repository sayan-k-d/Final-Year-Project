import {
  Admin,
  Forms,
  Surveyor,
  User,
  SurveyorForms,
  SuperAdmin,
} from "../../../db/models/index.js";
import { AuthenticationError } from "apollo-server";
import sgMail from "@sendgrid/mail";
import { config } from "dotenv";
config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
      let updateForm = Forms.findByIdAndUpdate(id, updateFormDataInput, {
        new: true,
      });
      return updateForm;
    } else {
      return new AuthenticationError();
    }
  },
  deleteForm: async (_, { id }, { currentUser }) => {
    if (currentUser) {
      const deletedForm = await Forms.findByIdAndDelete(id);
      if (deletedForm) return true;
      else return false;
    } else {
      return new AuthenticationError();
    }
  },
  requestFormSurveyor: async (_, { requestFormData }, { currentUser }) => {
    if (currentUser) {
      const getSurveyor = await User.findById(currentUser.userId);
      requestFormData.requestedSurveyor = getSurveyor;
      let requestedForm = await new SurveyorForms(requestFormData).save();
      return requestedForm;
    } else {
      return new AuthenticationError();
    }
  },

  assignAdminForm: async (_, { id, adminEmail }, { currentUser }) => {
    if (currentUser) {
      if (currentUser.userType === "SUPER_ADMIN") {
        const getSuperAdmin = await User.findById(currentUser.userId);
        const getAdmin = await User.findOne({ email: adminEmail });
        const updateRequestForm = await SurveyorForms.findByIdAndUpdate(
          id,
          { assignedAdmin: adminEmail },
          { new: true }
        );
        updateRequestForm.questions.map((question) => {
          console.log(question);
        });
        const mailPayload = `<h5>Hey <b>${getAdmin.fullName}</b></h5>,<br>
        <p><span style="color: #3ca10d">You've been assigned a new form by</span> <b>${
          getSuperAdmin.fullName
        }</b> (${getSuperAdmin.email}).</p>
        
        <p>Find below the form details given by surveyor- ${
          updateRequestForm.requestedSurveyor.email
        }.</p>
        
        <b>Form Title</b> : ${updateRequestForm.formTitle}<br>
        <b>Form Description</b>: ${updateRequestForm.description}<br>
        <b>Form Type</b>: ${updateRequestForm.formType}<br>
    
        <b>Questions</b>:<br>
                 ${updateRequestForm.questions.map((question) => {
                   return `[
          <p><b>Question:</b> ${question.questionTitle},</p>
          <p><b>Question Type:</b> ${question.questionType},</p>
          <p><b>Question Metadata:</b> ${question.questionMetadata}</p>]`;
                 })}`;

        let mailOptions = {
          to: adminEmail,
          from: "sayan.studenttiu2000@gmail.com",
          subject: `New Form Assigned`,
          html: mailPayload,
        };
        sgMail
          .send(mailOptions)
          .then(() => {
            console.log("Email sent");
          })
          .catch((error) => {
            console.error(error);
          });
        return updateRequestForm;
      } else {
        return new Error("Only Super Admin Has Access to This");
      }
    } else {
      return new AuthenticationError();
    }
  },
  deleteRequestForm: async (_, { id }, { currentUser }) => {
    if (currentUser) {
      const deleteReqForm = await SurveyorForms.findByIdAndDelete(id);
      if (deleteReqForm) return true;
      else return false;
    } else {
      return new AuthenticationError();
    }
  },
};
export default formMutations;
