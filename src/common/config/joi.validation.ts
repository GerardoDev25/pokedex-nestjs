import * as joi from 'joi';

export const joiValidationSchema = joi.object({
  MONGO_DB: joi.string().required(),
  PORT: joi.number().default(3000),
  DEFAULT_LIMIT: joi.number().default(7),
});
