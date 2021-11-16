import { Preso } from '@types'

let inMemDb: Map<String, Preso> | undefined = undefined

export function getInMemDb() {
  if (!inMemDb) {
    inMemDb = new Map<string, Preso>()
  }

  return inMemDb
}
