const Joi = require("joi");

exports.adminValidation = (data) => {
  const schemeAdmin = Joi.object({
    name: Joi.string().trim(true).uppercase().min(1).max(30),
    email: Joi.string().email().trim(true),
    phone: Joi.string().pattern(/^\+\d{1,3}\d{7,14}$/),
    password: Joi.string().required().min(8).alphanum(),
    is_active: Joi.boolean().default(false),
    is_creator: Joi.boolean().default(false),
    created_date: Joi.date().default(Date()),
    updated_date: Joi.date(),
    token: Joi.string().token(),
    activation_link: Joi.string(),
  });

  return schemeAdmin.validate(data, { abortEarly: false });
};
