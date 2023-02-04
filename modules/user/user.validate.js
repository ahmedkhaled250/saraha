import joi from "joi";

export const token = {
    headers:joi.object().required().keys({
        authorization:joi.string().required() 
    })
}
export const sharelinkprofile = {
    params:joi.object().required().keys({
        id:joi.string().required()
    })
}
export const updateProfile = {
    body:joi.object().required().keys({
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
        age: joi.number(),
        phone: joi.string(),
    }),
    headers:joi.object().required().keys({
        authorization:joi.string().required() 
    })
    .options({ allowUnknown: true }),
}
export const updatePassword = {
    body:joi.object().required().keys({
        oldPassword:joi.string()
        .pattern(
          new RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          )
        ),
        password:joi.string()
        .pattern(
          new RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          )
        ),
        cPassword: joi.string().valid(joi.ref("password")).required()
    }),
    headers:joi.object().required().keys({
        authorization:joi.string().required() 
    })
}