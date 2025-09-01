import { neon } from '@neondatabase/serverless';
export default defineCachedEventHandler(
  async (event) => {
    const { databaseUrl } = useRuntimeConfig();
    const db = neon(databaseUrl);
    const result = await db`SELECT key, meta_type, meta_model, meta_website, meta_manufacturer, meta_country_of_origin, features, application, source_table FROM all_products`;
    return result;
  },
  {
    maxAge: 60 * 60 * 24, // cache it for a day
  }
);