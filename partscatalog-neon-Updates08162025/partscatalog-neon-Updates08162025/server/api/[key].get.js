import { neon } from "@neondatabase/serverless";
import { Client } from 'pg';
//import pool from '../utils/db' // keep your db.js inside /server/utils
export default defineEventHandler(async (event) => {
  //const { databaseUrl } = useRuntimeConfig();
 // const db = neon(databaseUrl);
  /* const { dbHost } = useRuntimeConfig();
   const { dbPort } = useRuntimeConfig();
   const { dbName } = useRuntimeConfig();
   const { dbUser } = useRuntimeConfig();
   const { dbPassword } = useRuntimeConfig();
 const client = new Client({
    host: dbHost,
    port: Number(dbPort),
    database: dbName,
    user: dbUser,
    password: dbPassword,
  })*/
const productkey = getRouterParam(event, 'key')

  try {
    const result = await globalThis.pg.query(`
      SELECT 
        data ->> 'key' AS key,
        data ->> 'type' AS type,
        data ->> 'model' AS model,
        data ->> 'website' AS website,
        data ->> 'image_url' AS image_url,
        data ->> 'manufacturer' AS manufacturer,
        data ->> 'country_of_origin' AS country_of_origin,
        data ->> 'manufacturer_part_number' AS manufacturer_part_number,
        data ->> 'features' AS features,
        data ->> 'application' AS application,
        data ->> 'source_table' AS source_table
      FROM products where data->>'key' = $1
    `,[productkey])

  return { products: result.rows[0]  }
	
  } catch (error) {
  
    return { error: true, message: error.message }
  }
}); 
