import { Between, FindOptionsWhere, ILike, In, IsNull, LessThan, LessThanOrEqual, Like, MoreThan, MoreThanOrEqual, Not } from 'typeorm'
import { FilterToValueOperator, ValueOperator } from '../types/SchemaType'

function deepObject(obj: any) {
  if (Array.isArray(obj)) return transformTypeOrm(obj)
  else if (typeof obj === 'object' && obj !== null) Object.entries(obj).forEach(([k, v]) => (obj[k] = deepObject(v)))
  else if (typeof obj === 'string') return transformTypeOrm([{ value: obj, operator: 'equals' }])

  return obj
}

export function parseFilters<Entity>(filters: FilterToValueOperator<any>): FindOptionsWhere<Entity> {
  if (!filters) return {}
  const object: Record<string, any> = {}
  for (let [k, v] of Object.entries(filters)) {
    object[k] = deepObject(v)
  }

  return object
}

function transformTypeOrm(v: Array<ValueOperator>) {
  const value = v.map((it) => it.value)
  const operator = v.length > 1 ? v.find((it) => it.operator !== 'equals') : v[0]

  const op = operator ? operator.operator : 'equals'
  switch (op) {
    case '%like%':
      return Like(`%${value[0]}%`)
    case 'like%':
      return Like(`${value[0]}%`)
    case '%like':
      return Like(`%${value[0]}`)
    case 'like':
      return Like(value[0])
    case '%iLike%':
      return ILike(`%${value[0]}%`)
    case 'iLike%':
      return ILike(`${value[0]}%`)
    case '%iLike':
      return ILike(`%${value[0]}`)
    case 'iLike':
      return ILike(value[0])
    case 'moreThanOrEqual':
      return MoreThanOrEqual(value[0])
    case 'moreThan':
      return MoreThan(value[0])
    case 'lessThanOrEqual':
      return LessThanOrEqual(value[0])
    case 'lessThan':
      return LessThan(value[0])
    case 'between':
      return Between(value[0], value[1])
    case 'not':
      return Not(In(value))
    case 'isEmpty':
      return IsNull()
    case 'isNotEmpty':
      return Not(IsNull())
    default:
      return In(value)
  }
}
