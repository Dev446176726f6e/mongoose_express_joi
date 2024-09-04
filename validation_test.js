// const Joi = require("joi");

const Joi = require("joi");

const schema = Joi.object({
  username: Joi.string().min(3).max(40).required(),
  email: Joi.string().email().lowercase(),
  // email: Joi.string().required().pattern(new RegExp())
  password: Joi.string().min(8).required(),
  age: Joi.number().integer(),
  //   confirm_password: Joi.ref(),
  is_confirmed: Joi.boolean(),
  //   created_date: Joi.date().greater("now"),
  created_date: Joi.date().greater("10/10/2019").less("2040-01-01"),
  //   created_date: Joi.date().iso(),
  role: Joi.string().empty("").default("dismissed").trim(true).alphanum(),
  creadit_car: Joi.string().creditCard(),
});

const data = {
  username: "∂avron_bek",
  email: "xzero1119@gmail.com",
  password: "Td8du8vm7",
  age: 22,
  is_confirmed: true,
  created_date: Date(),
  role: "     ",
};

const { error, value } = schema.validate(data, { abortEarly: false });

if (error) {
  console.error("Validation Error: ", error.details);
} else {
  console.log("Validated Data", value);
}

// // Joi.array()
// // Joi.string()
// // Joi.number()
// // Joi.boolean()
// // Joi.object()
// // Joi.data()
// // Joi.any()
// // what is buffer.?

// Joi.alt()
