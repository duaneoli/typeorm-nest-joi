import { FindOptionsWhere } from 'typeorm'
import { FilterToValueOperator } from '../types'
import { parseFilters } from './ParseFilters'

export function JoinFilters<Entity>(filters: FindOptionsWhere<Entity>, filtersOr: FindOptionsWhere<Entity>): FindOptionsWhere<Entity>[] {
  if (!filtersOr || Object.keys(filtersOr).length == 0) return [filters]

  return Object.entries(filtersOr).reduce((acc, [key, value]) => {
    acc.push({
      ...filters,
      [key]: value,
    })
    return acc
  }, Array<FindOptionsWhere<Entity>>())
}

export function ParseJoinFilters<Entity>(filters: FilterToValueOperator<any>, filtersOr: FilterToValueOperator<any>): FindOptionsWhere<Entity>[] {
  const where = parseFilters(filters)
  const whereOr = parseFilters(filtersOr)
  return JoinFilters(where, whereOr)
}
