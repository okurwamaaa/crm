import * as Joi from "joi"
export const postgresSchema = Joi.object({
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().port().required()
})
export const pgAdminSchema = Joi.object({
  PGADMIN_DEFAULT_EMAIL: Joi.string().email().required(),
  PGADMIN_DEFAULT_PASSWORD: Joi.string().required(),
  PGADMIN_DEFAULT_PORT: Joi.number().port().required()
})
export const redisSchema = Joi.object({
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().port().required()
})
export const apiSchema = Joi.object({
  API_PORT: Joi.number().port().required()
})
export const nodeEnvSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("production")
})
export const configValidationSchema = Joi.object()
  .concat(postgresSchema)
  .concat(pgAdminSchema)
  .concat(redisSchema)
  .concat(apiSchema)
  .concat(nodeEnvSchema)
