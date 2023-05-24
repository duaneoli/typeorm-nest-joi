import * as Joi from 'joi'
import { getFiltersOperation } from '../helpers/GetFiltersOperatation'

type queryType = 'filter' | 'sort' | 'select' | 'column'

export function entityColumn(joi: Joi.Schema, type: queryType = 'column') {
  const operator = getFiltersOperation(joi)

  switch (type) {
    case 'filter':
      return Joi.array().items(
        Joi.object({
          value: Joi.when('operator', {
            is: Joi.string().equal('equals'),
            then: Joi.alternatives(Joi.array().items(joi), joi),
            otherwise: Joi.alternatives(Joi.array().items(Joi.any()), Joi.any()),
          }),
          operator: Joi.alternatives().try(
            Joi.string().valid('').empty('').default('equals'), // accept only empty strings and convert those to null
            Joi.string()
              .valid(...operator, 'equals')
              .default('equals'),
          ),
        }),
      )
    case 'sort':
      return Joi.string().uppercase().valid('ASC', 'DESC')
    case 'select':
      return Joi.boolean().default(true)
    default:
      return joi
  }
}
