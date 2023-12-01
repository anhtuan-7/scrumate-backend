const Joi = require('joi');

const projectCreateSchema = Joi.object({
  name: Joi.string().required(),
  key: Joi.string().uppercase().min(3).max(8).required(),
  description: Joi.string(),
  repository: Joi.string().uri(),
});

const projectUpdateSchema = Joi.object({
  name: Joi.string(),
  key: Joi.string().uppercase().min(3).max(8),
  description: Joi.string(),
  repository: Joi.string().uri(),
});

module.exports = { projectCreateSchema, projectUpdateSchema };
