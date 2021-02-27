import { Connection, createConnection, getConnectionOptions } from 'typeorm'

export default async (): Promise<Connection> => {

  //default db options(ormconfig)
  const defaultOptions = await getConnectionOptions()

  return createConnection(
    Object.assign(defaultOptions, {
      // if TEST, than use test.db, else use production db
      database: process.env.NODE_ENV === 'test' ? './src/config/database/db.test.sqlite' : defaultOptions.database
    })
  )
}