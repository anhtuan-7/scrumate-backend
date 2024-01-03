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

const addMemberSchema = Joi.object({
  email: Joi.string().email().required(),
  role: Joi.string().valid(
    'product-owner',
    'scrum-master',
    'developer',
    'inactive',
  ),
});

const updateRoleSchema = Joi.object({
  role: Joi.string()
    .valid('product-owner', 'scrum-master', 'developer', 'inactive')
    .required(),
});

module.exports = {
  projectCreateSchema,
  projectUpdateSchema,
  addMemberSchema,
  updateRoleSchema,
};
