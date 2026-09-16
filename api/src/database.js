import "dotenv/config";
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: true } : false,
});

// search_pathin asetus ei ole tarpeen jos käytät public-schemaa
/*
pool.on("connect", (client) => {
  client.query("SET search_path TO libschema, public;").catch((err) => {
    console.error("Virhe search_pathin asettamisessa:", err);
  });
});
*/
export default pool;
