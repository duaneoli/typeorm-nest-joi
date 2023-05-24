import { splitQuery } from './SplitQuery'

export function constructObject(object: Record<string, any>, key: string, value: any, type?: 'filter' | 'sort') {
  const [k, ...kk] = key.split('.')
  if (!object[k]) object[k] = {}
  if (kk.length > 0) {
    constructObject(object[k], kk.join('.'), value, type)
  } else object[k] = type === 'filter' ? splitQuery(value) : value
}
