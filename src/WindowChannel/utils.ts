export type Dict<T = any> = Record<string, T>

export function isDefinedNotNull(value: any) {
    return typeof value !== 'undefined' && value !== null
}

export function isArray<T>(value: any): value is Array<T> {
    return Array.isArray(value)
}

export const isObject = (value: any): value is Dict => {
    const type = typeof value
    return (
      value != null &&
      (type === "object" || type === "function") &&
      !isArray(value)
    )
  }