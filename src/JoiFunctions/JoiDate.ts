import * as Joi from 'joi'

type DateJoiType = string | number | Date | Joi.Reference

export function JoiDate(greater?: DateJoiType, less?: DateJoiType, greaterRef?: string, lessRef?: string) {
  let date = Joi.date()
  if (greater) date = date.greater(greater)
  if (less) date = date.less(less)
  if (greaterRef) date = date.when(greaterRef, { is: Joi.exist(), then: Joi.date().min(Joi.ref(greaterRef)) })
  if (lessRef) date = date.when(lessRef, { is: Joi.exist(), then: Joi.date().max(Joi.ref(lessRef)) })
  return date
}
