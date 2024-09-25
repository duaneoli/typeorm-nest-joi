import { FindOptionsWhere } from 'typeorm'
import { FilterToValueOperator } from '../types'
import { parseFilters } from './ParseFilters'

export function JoinFilters<Entity>(filters: FindOptionsWhere<Entity>, filtersOr: FindOptionsWhere<Entity>): FindOptionsWhere<Entity>[] | undefined {
  if (!filtersOr || Object.keys(filtersOr).length == 0) return Object.keys(filters).length > 0 ? [filters] : undefined
  const result: FindOptionsWhere<Entity>[] = [];

  const mergeFilters = (key: string, value: any) => {
    if (!isObject(value)) {
      result.push({ ...filters, [key]: value });
    } else {
      Object.entries(value).forEach(([innerKey, innerValue]) => {
        result.push({ ...filters, [key]: { [innerKey]: innerValue } });
      });
    }
  };

  Object.entries(filtersOr).forEach(([key, value]) => {
    mergeFilters(key, value);
  });

  return result
}

export function ParseJoinFilters<Entity>(filters: FilterToValueOperator<any>, filtersOr: FilterToValueOperator<any>): FindOptionsWhere<Entity>[] | undefined {
  const where = parseFilters(filters)
  const whereOr = parseFilters(filtersOr)
  return JoinFilters(where, whereOr)
}

function isObject(value: any): boolean {
  if (typeof value === 'object' && value !== null) {
    return Object.keys(value).some(key => typeof value[key] === 'object' && value[key] !== null)
  }
  return false
}
