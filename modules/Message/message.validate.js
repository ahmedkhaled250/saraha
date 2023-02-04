import joi from "joi";

export const token = {
    headers:joi.object().required().keys({
        authorization:joi.string().required() 
    })
}
export const sendMessageAndToken = {
    params:joi.object().required().keys({
        messageId:joi.string().required()
    }),
    headers:joi.object().required().keys({
        authorization:joi.string().required() 
    })
}
export const sendMessage = {
    params:joi.object().required().keys({
        recievedId:joi.string().required()
    })
}