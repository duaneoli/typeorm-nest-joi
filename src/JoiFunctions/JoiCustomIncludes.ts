import * as Joi from 'joi'
import { includesValidation } from '../helpers/IncludeValidation'

export function joiCustomIncludes(...keys: Array<string>) {
  return Joi.custom((value) => {
    const { includes, result } = includesValidation(value, keys)
    if (result.error) throw Error(result.error.details[0].message)
    return includes
  })
}
