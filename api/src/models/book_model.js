import pool from "../database.js";

export async function getAll() {
  const result = await pool.query("SELECT * FROM book");
  return result.rows; 
}

export async function getOne(id) {
  const result = await pool.query("SELECT * FROM book WHERE id_book = $1", [id]);
  return result.rows.length > 0 ? result.rows[0] : null;
}