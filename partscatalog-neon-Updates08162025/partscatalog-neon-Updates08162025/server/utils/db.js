import { Pool } from 'pg'

const pool = new Pool({
  user: 'zach',
  host: 'localhost',
  database: 'products_db',
  password: 'admin',
  port: 5432
})

export default pool