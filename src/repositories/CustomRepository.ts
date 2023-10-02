import { Injectable } from '@nestjs/common'
import { DataSource, EntityTarget, FindManyOptions, FindOptionsSelect, ObjectLiteral, Repository, getMetadataArgsStorage } from 'typeorm'

@Injectable()
export class CustomRepository<Entity extends ObjectLiteral> extends Repository<Entity> {
  constructor(target: EntityTarget<Entity>, dataSource: DataSource) {
    super(target, dataSource.createEntityManager())
  }

  getEntityColumnDefinition() {
    return getMetadataArgsStorage().columns.filter((column) => column.target === this.target)
  }

  getMapPropertyNameHasName(): Record<keyof Entity, string> {
    return this.getEntityColumnDefinition().reduce((acc, column) => {
      acc[column.propertyName as keyof Entity] = column.options.name || column.propertyName
      return acc
    }, {} as Record<keyof Entity, string>)
  }

  replaceColumnNameEntityToDatabase(nameEntityColumns: Array<keyof Entity>) {
    const propertyNameHasName = this.getMapPropertyNameHasName()
    return nameEntityColumns.map((column) => propertyNameHasName[column])
  }

  replaceColumnNameDatabaseToEntity(columns: Array<string>): Array<keyof Entity> {
    const propertyNameHasName = this.getMapPropertyNameHasName()
    const nameHasPropertyName = Object.entries(propertyNameHasName).reduce((acc, it) => {
      acc[it[1]] = it[0]
      return acc
    }, {} as Record<string, keyof Entity>)
    const ret = Array<string>()
    columns.forEach((column) => {
      if (nameHasPropertyName[column]) ret.push(column)
    })
    return ret.map((it) => it[0])
  }

  getSelectArray(selectColumns: Record<keyof Entity, boolean>) {
    const arraySelect = Object.entries(selectColumns)
      .filter((it) => it[1] === true)
      .map((it) => it[0])
    return this.replaceColumnNameEntityToDatabase(arraySelect)
  }

  generateObjectSelect(select?: FindOptionsSelect<Entity>): Record<keyof Entity, boolean> {
    const propertyNameHasName = this.getMapPropertyNameHasName()
    let type: 'ALL' | 'SELECT' | 'INVERSE-SELECT' = 'ALL'
    if (select) {
      if (Object.entries(select).some((it) => it[1] == true)) type = 'SELECT'
      else type = 'INVERSE-SELECT'
    }
    const ret = {} as Record<keyof Entity, boolean>
    Object.keys(propertyNameHasName).forEach((key: keyof Entity) => {
      switch (type) {
        case 'SELECT':
          if (select && select[key]) ret[key] = select[key] as boolean
          else ret[key] = false
          break
        case 'INVERSE-SELECT':
          if (select && select[key] != undefined) ret[key] = select[key] as boolean
          else ret[key] = true
          break
        default:
          ret[key] = true
          break
      }
    })
    return ret
  }

  replaceColumnNameDatabaseToEntities(entities: Array<Record<keyof Entity, any>>): Array<Entity & { amountGroup?: number }> {
    const propertyNameHasName = this.getMapPropertyNameHasName()
    const ret = Array<Entity>()
    entities.forEach((entity) => {
      const newEntity = this.create()
      Object.entries(entity).forEach(([key, value]: [keyof Entity, any]) => {
        let newKey = undefined
        if (key === 'amount_group') newKey = 'amountGroup'
        else {
          const k = Object.entries(propertyNameHasName).find(([_, name]) => name === key)
          newKey = k ? k[0] : undefined
        }
        if (!newKey) newEntity[key] = value
        else newEntity[newKey as keyof Entity] = value
      })
      ret.push(newEntity)
    })
    return ret
  }

  replaceColumnNameEntityToDatabaseObject<T extends Record<keyof Entity, K>, K extends any>(entity: Record<keyof Entity, K>): Record<string, K> {
    const propertyNameHasName = this.getMapPropertyNameHasName()
    return Object.entries(entity).reduce((acc, column) => {
      acc[propertyNameHasName[column[0]]] = column[1]
      return acc
    }, {} as Record<string, K>)
  }

  async findAndCountWithGroup(
    options?: FindManyOptions<Entity> & { groupBy?: Array<keyof Entity>; select?: FindOptionsSelect<Entity> },
  ): Promise<[Array<Entity>, number]> {
    const selectColumns = this.generateObjectSelect(options?.select)
    if (!options?.groupBy) return this.findAndCount({ ...options, select: selectColumns as FindOptionsSelect<Entity> })
    const arraySelectToDatabase = this.getSelectArray(selectColumns)
    const qr = this.createQueryBuilder().select(arraySelectToDatabase)
    qr.addSelect('count(*) as amount_group').where(options.where || {})
    const keysEntityDatabase = this.replaceColumnNameEntityToDatabase(options.groupBy)
    keysEntityDatabase.forEach((groupBy, index) => (index === 0 ? qr.groupBy(groupBy) : qr.addGroupBy(groupBy)))
    const qrCount = qr.clone()
    qr.take(options.take).skip(options.skip)

    const sortBy: Record<string, 'ASC' | 'DESC'> = this.replaceColumnNameEntityToDatabaseObject(
      Object.entries(options.order || {}).reduce((acc, [key, value]) => {
        if (typeof value === 'string') acc[key as keyof Entity] = value.toUpperCase() as 'ASC' | 'DESC'
        return acc
      }, {} as Record<keyof Entity, 'ASC' | 'DESC'>),
    )
    Object.entries(sortBy).forEach(([key, value], index) => (index === 0 ? qr.orderBy(key, value) : qr.addOrderBy(key, value)))
    let [subQuery, paramsSubQuery] = qrCount.getQueryAndParameters()
    if (paramsSubQuery) paramsSubQuery.map((it, index) => (subQuery = subQuery.replaceAll(`$${index + 1}`, `'${it}'`)))
    const promises = [this.query(`select COUNT(*) as total_count from (${subQuery}) as subquery`), qr.getRawMany()]
    const [count, entities] = await Promise.all(promises)
    const retEntities: Array<Entity> = this.replaceColumnNameDatabaseToEntities(entities)
    return [retEntities, Number(count[0].total_count)]
  }
}
