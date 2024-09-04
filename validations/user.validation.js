const Joi = require("joi");

exports.userValidation = (data) => {
  const schemeUser = Joi.object({
    name: Joi.string().trim(true).uppercase().min(1).max(30),
    email: Joi.string().email().trim(true),
    password: Joi.string().required().min(8).alphanum(),
    info: Joi.string().trim().default("No Info"),
    photo: Joi.string(),
    created_date: Joi.date(),
    updated_date: Joi.date(),
    is_active: Joi.boolean().default(false),
    token: Joi.string().token(),
    activation_link: Joi.string(),
  });

  return schemeAdmin.validate(data, { abortEarly: false });
};
