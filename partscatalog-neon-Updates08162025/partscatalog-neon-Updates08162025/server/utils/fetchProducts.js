import { neon } from '@neondatabase/serverless';
import { Client } from 'pg';
export const fetchProducts = async () => {
   /* const { databaseUrl } = useRuntimeConfig();
    const db = neon(databaseUrl);*/
	 const { dbHost } = useRuntimeConfig();
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
  })
 await client.connect()
    return await db`SELECT key, meta_type, meta_model, meta_website, meta_manufacturer, meta_country_of_origin, features, application, source_table FROM all_products`;
};