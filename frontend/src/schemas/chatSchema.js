import * as yup from "yup";

export const chatSchema = yup.object({
    message: yup.string().required("Please provide a message").trim()
});
