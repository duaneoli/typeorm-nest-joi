import * as Joi from 'joi'
type StringType = 'any' | 'alphabet' | 'alphanumeric' | 'base64' | 'filename' | 'image' | 'uuid' | 'jwt'

export const JoiString = (type: StringType = 'any') => {
  const stringTypes = {
    any: Joi.string(),
    alphabet: Joi.string().regex(/([a-zA-Z \u00C0-\u00ff]+)/),
    alphanumeric: Joi.string().regex(/([a-zA-Z0-9 \u00C0-\u00ff]+)/),
    base64: Joi.string().base64(),
    filename: Joi.string().regex(/^[\w,\s-]+\.[A-Za-z]{3}$/),
    image: Joi.string().valid('image/png'),
    jwt: Joi.string().regex(/(^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$)/),
    uuid: Joi.string().uuid(),
  }

  return stringTypes[type];
}
