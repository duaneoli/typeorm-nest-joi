import * as Joi from 'joi'

export function joiArrayObject(joi: any, minKeyInObject: number = 1, unique: string = 'id') {
  return Joi.array().items(Joi.object(joi).min(minKeyInObject)).min(1).unique(unique, { ignoreUndefined: true })
}
