import * as Joi from 'joi'

export function includesValidation(value: string | Array<string>, validationSchema: Array<string>) {
  const array = typeof value === 'string' ? value.replace(' ', '').split(',') : value.flatMap((it) => it.replace(' ', '').split(','))
  const includesValues = new Set()

  array.forEach((it) => {
    const splitIt = it.split('.')
    let lastValue = ''
    splitIt.forEach((split) => {
      lastValue = lastValue === '' ? split : lastValue + '.' + split
      includesValues.add(lastValue)
    })
  })

  return {
    includes: [...includesValues],
    result: Joi.array()
      .items(Joi.string().valid(...validationSchema))
      .validate([...includesValues]),
  }
}
