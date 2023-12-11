const Joi = require('joi');

const projectCreateSchema = Joi.object({
  name: Joi.string().required(),
  key: Joi.string().uppercase().min(3).max(8).required(),
  description: Joi.string().allow(null, ''),
  repository: Joi.string().uri().allow(null, ''),
});

const projectUpdateSchema = Joi.object({
  name: Joi.string(),
  key: Joi.string().uppercase().min(3).max(8),
  description: Joi.string().allow(null, ''),
  repository: Joi.string().uri().allow(null, ''),
});

module.exports = { projectCreateSchema, projectUpdateSchema };
