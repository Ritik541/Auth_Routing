/* import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const { DB_HOST, DB_DATABASE, DB_USER, DB_PASSWORD, DB_PORT } = process.env;
console.log(DB_HOST, DB_DATABASE, DB_USER, DB_PASSWORD, DB_PORT);

const db_info = {
  host: DB_HOST,
  database: DB_DATABASE,
  user: DB_USER,
  password: DB_PASSWORD,
//  port: DB_PORT,
//  ssl: { rejectUnauthorized: false } // 👈 Railway ke liye zaroori hai
};

export const pool = mysql.createPool(db_info);

export const checkConnection = async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Database Connected...");
    conn.release();
  } catch (err) {
    console.log("❌ Connection failed:", err);
  }
};
 */