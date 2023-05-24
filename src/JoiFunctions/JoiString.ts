import * as Joi from 'joi'
type StringType = 'any' | 'alphabet' | 'alphanumeric' | 'base64' | 'filename' | 'image' | 'uuid' | 'jwt'

export const JoiString = (type: StringType = 'any') => {
  switch (type) {
    case 'alphabet':
      return Joi.string().regex(/([a-zA-Z \u00C0-\u00ff]+)/)
    case 'alphanumeric':
      return Joi.string().regex(/([a-zA-Z0-9 \u00C0-\u00ff]+)/)
    case 'base64':
      return Joi.string().base64()
    case 'filename':
      return Joi.string().regex(/^[\w,\s-]+\.[A-Za-z]{3}$/)
    case 'image':
      return Joi.string().valid('image/png')
    case 'jwt':
      return Joi.string().regex(/(^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$)/)
    case 'uuid':
      return Joi.string().uuid()
    default:
      return Joi.string()
  }
}
