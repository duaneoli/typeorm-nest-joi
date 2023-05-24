import * as Joi from 'joi'
import { constructObject } from './ContructObject'
import { keyValueToObject } from './KeyValueToObject'

export function objectValidation(value: string | Array<string>, validationSchema: Joi.ObjectSchema, type?: 'filter' | 'sort') {
  const objectParse = {}
  if (Array.isArray(value) || typeof value === 'string') {
    const object = keyValueToObject(typeof value === 'string' ? [value] : value)
    Object.entries(object).forEach(([key, value]) => constructObject(objectParse, key, value, type))
  } else Object.assign(objectParse, value)
  if (!objectParse) {
    return { value: undefined, error: undefined, errorMessage: 'not parsing filter' }
  } else {
    return validationSchema.validate(objectParse, { abortEarly: false })
  }
}
