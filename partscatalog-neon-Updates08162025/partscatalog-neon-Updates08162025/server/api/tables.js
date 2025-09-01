import { neon } from '@neondatabase/serverless';
export default defineCachedEventHandler(
  async (event) => {
    const { databaseUrl } = useRuntimeConfig();
    const db = neon(databaseUrl);
    const results = await db
    `SELECT table_name FROM information_schema.tables WHERE table_schema = 'google_drive'`;
    return results;
  },
  {
    maxAge: 60 * 60 * 24, // cache it for a day
  }
);