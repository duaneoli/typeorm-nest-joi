export type Operator =
  | 'isEmpty'
  | 'isNotEmpty'
  | 'not'
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'moreThan'
  | 'moreThanOrEqual'
  | 'equals'
  | 'between'
  | 'iLike'
  | '%iLike'
  | 'iLike%'
  | '%iLike%'
  | 'like'
  | '%like'
  | 'like%'
  | '%like%'

export type otherSchemaSort<T> = T extends Record<string, any> ? SchemaSort<T> : 'ASC' | 'DESC'

export type SchemaSort<T extends Record<string, any>> = {
  [key in keyof T]?: otherSchemaSort<T[key]>
}

export type otherSchemaFilter<T> = T extends Record<string, any> ? SchemaFilter<T> : T

export type SchemaFilter<T extends Record<string, any>> = {
  [key in keyof T]?: otherSchemaFilter<T[key]>
}

export type SchemaIncludes<T extends Record<string, any>> = {
  [key in keyof T as T[key] extends Record<string, any> ? key : never]: SchemaIncludes<T[key]>
}

export type SchemaType<T extends Record<string, any>> = {
  filters: SchemaFilter<T>
  sort: SchemaSort<T>
  include: SchemaIncludes<T>
} & T

export type EntityColumnType = 'column' | 'filter' | 'sort'

export type FilterOperator = 'equals' | 'not';

export type FilterValue =  {
  value: string | number;
  operator: FilterOperator;
}


export type ValueOperator = { value: any; operator?: Operator }

export type ToValueOperator<T> = T extends Record<string, any> ? FilterToValueOperator<T> : ValueOperator[]

export type FilterToValueOperator<T> = {
  [key in keyof T]: ToValueOperator<T[key]>
}
