const Joi = require('joi');

const organizationCreateSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
});

const addMemberSchema = Joi.object({
  email: Joi.string().email().required(),
  role: Joi.string().valid('member', 'group-admin', 'project-admin'),
});

module.exports = { organizationCreateSchema, addMemberSchema };
