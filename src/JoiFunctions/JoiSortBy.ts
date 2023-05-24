import * as Joi from 'joi'

export function joiSortBy(...keys: Array<string>) {
  return Joi.object(
    keys.reduce((acc, it) => {
      acc[it] = Joi.string().valid('ASC', 'DESC')
      return acc
    }, {} as { [key: string]: Joi.Schema }),
  )
}
