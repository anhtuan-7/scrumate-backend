const Joi = require('joi');

const sprintCreateSchema = Joi.object({
  name: Joi.string().required(),
});

module.exports = { sprintCreateSchema };
