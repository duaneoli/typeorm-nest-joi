const baseOperator: Record<string, any> = {
  iLike: ['iLike', '%iLike', 'iLike%', '%iLike%'],
  like: ['like', '%like', 'like%', '%like%'],
  more: ['moreThan', 'moreThanOrEqual'],
  less: ['lessThan', 'lessThanOrEqual'],
  between: ['between'],
  match: ['not', 'equals'],
  content: ['isEmpty', 'isNotEmpty'],
}

const unionOperator: Record<string, any> = {
  ...baseOperator,
  base: Array().concat(baseOperator.match, baseOperator.content),
  case: Array().concat(baseOperator.like, baseOperator.iLike),
  interval: Array().concat(baseOperator.more, baseOperator.less, baseOperator.between),
}

const operators = {
  ...unionOperator,
  all: Array().concat(...Object.keys(baseOperator).map((key) => baseOperator[key])),
  uuid: Array().concat(unionOperator.base),
  string: Array().concat(unionOperator.base, unionOperator.case),
  boolean: Array().concat(unionOperator.base),
  number: Array().concat(unionOperator.base, unionOperator.interval),
  date: Array().concat(unionOperator.base, unionOperator.interval),
}

export default operators
