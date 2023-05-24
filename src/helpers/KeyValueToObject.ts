export function keyValueToObject(data: Array<string>): any {
  if (!data.length) return data

  const normalized = data?.reduce((acc, it) => {
    acc.push(...it.split(';').filter((it) => it !== ''))
    return acc
  }, [] as Array<string>)

  const result = normalized?.reduce((acc, currentElement) => {
    const [key, value] = currentElement.split(':')
    if (!value) return acc

    const values = value.split(',').filter((it) => it !== '')
    if (acc[key] === undefined) acc[key] = values
    else acc[key].push(...values)

    return acc
  }, {} as { [key: string]: any })

  Object.keys(result).forEach((key) => {
    if (result[key].length === 1) result[key] = result[key][0]
  })

  return result
}
