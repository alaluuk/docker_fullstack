import "dotenv/config";
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});
// SSL-yhteys on käytössä kun DB_SSL=true. rejectUnauthorized: false tarkoittaa,
// että liikenne salataan mutta palvelimen sertifikaattia ei vahvisteta —
// riittävä sisäverkossa tai hallituissa pilvipalveluissa, mutta julkisessa
// internetissä harkitse CA-sertifikaatin lisäämistä MITM-hyökkäyksiä vastaan.

// search_pathin asetus ei ole tarpeen jos käytät public-schemaa
/*
pool.on("connect", (client) => {
  client.query("SET search_path TO libschema, public;").catch((err) => {
    console.error("Virhe search_pathin asettamisessa:", err);
  });
});
*/
export default pool;
