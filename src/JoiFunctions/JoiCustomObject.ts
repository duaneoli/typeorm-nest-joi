import * as Joi from 'joi'
import { objectValidation } from '../helpers/ObjectValidation'

export function joiCustomObject(joi: any, type?: 'filter' | 'sort') {
  return Joi.custom((v) => {
    const { error, value } = objectValidation(v, joi, type)
    if (error) throw Error(error.details[0].message)
    return value
  })
}
