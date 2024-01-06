const Joi = require('joi');

const sprintCreateSchema = Joi.object({
  name: Joi.string().required(),
});

const sprintUpdateSchema = Joi.object({
  name: Joi.string(),
  sprintGoal: Joi.string(),
  startDate: Joi.date(),
  duration: Joi.number(),
});

const startSprintSchema = Joi.object({
  sprintGoal: Joi.string().allow(null),
  startDate: Joi.date().required(),
  duration: Joi.number().required(),
});

module.exports = { sprintCreateSchema, sprintUpdateSchema, startSprintSchema };
