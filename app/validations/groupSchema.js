const Joi = require('joi');

const groupCreateSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(0).max(255),
});

const addMemberSchema = Joi.object({
  email: Joi.string().email().required(),
  role: Joi.string().valid('member', 'group-admin', 'project-admin'),
});

module.exports = { groupCreateSchema, addMemberSchema };
