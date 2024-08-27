

// Function: notAllowedKeyByPermission
// This function returns the filters that the user cannot access based on their role.
// It expects you to provide the filter type, the roles, and as a third parameter, specify the parameters that should be excluded based on the role.

import { FilterValue } from "../types"

export function notAllowedKeyByPermission<T extends Record<string, any>, R extends Array<string>>(
  filter: Partial<T>,
  userType: R[number],
  notAllowedKeysByPermission: Partial<Record<R[number], Partial<Array<keyof T>>>>,
): Partial<T> {

  const notAllowedKeys = notAllowedKeysByPermission[userType] || []
  
  if (notAllowedKeys.length === 0) return {}
  const _filter = filter
  notAllowedKeys.forEach((it) => {
    if (it) delete _filter[it]
  })

  return _filter
}



// Function: allowedKeyByPermission
// This function returns which filters can be used based on the role.
// It expects you to provide the type of the filter, the roles, and as a third parameter, specify the parameters to be filtered according to the role.

export function allowedKeyByPermission<T extends Record<string, any>, R extends Array<string>>(
  filter: Partial<T>,
  userType: R[number],
  allowedKeysByPermission: Partial<Record<R[number], Partial<Array<keyof T>>>>,
): Partial<T> {

  const allowedKeys = allowedKeysByPermission[userType]  || []

  if (allowedKeys.length === 0 || filter === undefined) return filter

  const _filter: Partial<T> = {}

  allowedKeys.forEach((it) => {
    if (it)  _filter[it] = filter[it]
  })

  return _filter
}



// The setFilterByPermission function adjusts a set of filters based on user permissions.

// Here’s how it works:

// 1-Initial Setup: It takes the current filters, identifies primary keys that need filtering, and prepares to fetch values for these keys.
// 2-Fetch Values: It calls the getValues function to get a list of values for the primary keys.
// 3-Update Filters:
// If no values are returned, it returns the original filters.
// If there are values, it updates the filters based on the operators specified:
// equals: Keeps only those filters whose values match the fetched values.
// not: Removes filters whose values are included in the fetched values.
// Return Updated Filters: It returns the updated filters with the applied permissions.


export async function setFilterByPermission<T extends Record<string, FilterValue[]>>(
  filters: T,
  primaryKeys: Array<keyof T>,
  entityKey: string,
  getValues: (e: Record<string, Array<string | number>>) => Promise<Array<Record<string, any>>>
): Promise<Partial<T>> {

  const primaryKeysHasFiltersValues: Record<string, Array<string | number>> = {};

  primaryKeys.forEach((it) => {
    primaryKeysHasFiltersValues[it as string] = filters !== undefined && filters[it]?.length > 0 ? filters[it].map((it) => it.value) : []
  })

  const values = await getValues(primaryKeysHasFiltersValues);

  if (values.length === 0 || values === undefined) return filters

  const _filters: Partial<T> = { ...filters };

  primaryKeys.forEach((key) => {
    const currentFilter = filters[key] || [];

    if (currentFilter.length === 0) {
      _filters[key] = values.map(value => ({
        value: value[entityKey],
        operator: 'equals'
      })) as T[keyof T];
    } else {

      _filters[key] = currentFilter.filter(filter => {
        switch (filter.operator) {
          case 'equals':
            return values.some(value => value[entityKey] === filter.value);
          case 'not':
            return !values.some(value => value[entityKey] === filter.value);
          default:
            throw new Error('Invalid operator');
        }
      }) as T[keyof T];
    }
  });
  return _filters
}
