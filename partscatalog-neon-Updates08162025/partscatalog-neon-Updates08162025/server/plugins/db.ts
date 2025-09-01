import { Pool } from 'pg'

export default defineNitroPlugin(() => {
  const config = useRuntimeConfig()

  // Use the DATABASE_URL directly
  const pool = new Pool({
    connectionString: config.databaseUrl,
    
  })

  globalThis.pg = pool
})
