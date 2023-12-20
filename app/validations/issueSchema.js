const Joi = require('joi');

const issueCreateSchema = Joi.object({
  title: Joi.string().max(255).required(),
  description: Joi.string().allow(null, ''),
  type: Joi.string().valid('task', 'bug', 'story'),
  priority: Joi.string().valid('low', 'medium', 'high', 'best-effort'),
});

const issueUpdateSchema = Joi.object({
  title: Joi.string().max(255),
  description: Joi.string().allow(null, ''),
  type: Joi.string().valid('task', 'bug', 'story'),
  priority: Joi.string().valid('low', 'medium', 'high', 'best-effort'),
  status: Joi.string().valid('to-do', 'in-progress', 'done'),
  sprintId: Joi.number().allow(null),
  assigneeId: Joi.number().allow(null),
});

module.exports = {
  issueCreateSchema,
  issueUpdateSchema,
};
