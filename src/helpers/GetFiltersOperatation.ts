import * as Joi from 'joi'
import Operators from './Operator'

export function getFiltersOperation(joi: Joi.Schema) {
  const j: any = joi
  const type = joi.type
  const role = j['_rules'][0]?.name

  switch (type) {
    case 'string': {
      if (role === 'guid') return Operators.uuid
      return Operators.string
    }
    case 'date':
      return Operators.date
    case 'boolean':
      return Operators.boolean
    case 'number':
      return Operators.number
    default:
      return Operators.all
  }
}
