const Joi = require("joi");

exports.authorValidation = (data) => {
  const schemeAuthor = Joi.object({
    first_name: Joi.string().trim(true).uppercase().min(1).max(30),
    last_name: Joi.string().trim(true).uppercase().min(1).max(30),
    nick_name: Joi.string().trim(true).uppercase().min(1).max(30),
    email: Joi.string().email().trim(true),
    phone: Joi.string().pattern(/^\+\d{1,3}\d{7,14}$/),
    password: Joi.string().required().min(8).alphanum(),
    info: Joi.string().trim().default("No Info"),
    position: Joi.string().required(),
    photo: Joi.string(),
    is_expert: Joi.boolean().default(false),
    is_active: Joi.boolean().default(false),
    token: Joi.string().token(),
    activation_link: Joi.string(),
  });

  return schemeAdmin.validate(data, { abortEarly: false });
};
