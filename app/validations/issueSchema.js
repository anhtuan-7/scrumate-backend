const Joi = require('joi');

const issueCreateSchema = Joi.object({
  title: Joi.string().max(255).required(),
  description: Joi.string(),
  type: Joi.string().valid('task', 'bug', 'story'),
  priority: Joi.string().valid('low', 'medium', 'high', 'best-effort'),
});

const issueUpdateSchema = Joi.object({
  title: Joi.string().max(255),
  description: Joi.string(),
  type: Joi.string().valid('task', 'bug', 'story'),
  priority: Joi.string().valid('low', 'medium', 'high', 'best-effort'),
  status: Joi.string().valid('to-do', 'in-progress', 'done'),
});

const issueSprintUpdateSchema = Joi.object({
  sprintId: Joi.number().required(),
});

const issueAssigneeUpdateSchema = Joi.object({
  asigneeId: Joi.number().required(),
});

module.exports = {
  issueCreateSchema,
  issueUpdateSchema,
  issueSprintUpdateSchema,
  issueAssigneeUpdateSchema,
};
