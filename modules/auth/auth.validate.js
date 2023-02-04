import joi from "joi";
export const signup = {
  body: joi
    .object()
    .required()
    .keys({
      firstName: joi.string().required(),
      lastName: joi.string().required(),
      email: joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.empty": "not allowed to be empty",
        "string.base": "only string is allowed",
        "string.email": "please enter realy email",
      }),
      password: joi
        .string()
        .pattern(
          new RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          )
        )
        .required(),
      cPassword: joi.string().valid(joi.ref("password")).required(),
      age: joi.number(),
      phone: joi.string(),
    }),
};
export const signin = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.empty": "not allowed to be empty",
        "string.base": "only string is allowed",
        "string.email": "please enter realy email",
      }),
      password: joi
        .string()
        .pattern(
          new RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          )
        )
        .required(),
    }),
};
export const token = {
  params: joi.object().required().keys({
    token: joi.string().required(),
  }),
};
export const logOut = {
  headers: joi.object().required().keys({
    authorization: joi.string().required(),
  }).options({allowUnknown:true}),
};
export const sendCode = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.empty": "not allowed to be empty",
        "string.base": "only string is allowed",
      }),
    }),
};
export const forgetPssword = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.empty": "not allowed to be empty",
        "string.base": "only string is allowed",
      }),
      code: joi.string().min(4).max(4).required(),
      password: joi
        .string()
        .pattern(
          new RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          )
        )
        .required(),
    }),
};
