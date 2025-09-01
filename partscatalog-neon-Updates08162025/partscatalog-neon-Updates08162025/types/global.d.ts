import type { Pool } from 'pg'

declare global {
  var pg: Pool
}