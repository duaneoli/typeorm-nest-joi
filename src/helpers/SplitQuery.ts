export function splitQuery(value: string | Array<string>) {
  const _value = typeof value === 'string' ? [value] : value
  const valueReturn = _value.map((it) => {
    const v = it.split('$')
    if (v.length === 1) v.push('')
    return { value: v[0], operator: v[1] }
  })
  return valueReturn
}
