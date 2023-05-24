import { FilterToValueOperator } from '../types/SchemaType'

export function mergeFilters<T extends FilterToValueOperator<any>>(filters: T, otherFilter: Partial<T>): T {
  return Object.assign(filters ? filters : ({} as T), otherFilter)
}
