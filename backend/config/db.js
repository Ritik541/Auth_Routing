import { Pool } from "pg";

const {DB_HOST,DB_USER,DB_PASSWORD,DB_DATABASE} = process.env; 

export const pool = new Pool({
  user: "DB_USER",      
  host: "DB_HOST",         
  database: "DB_DATABASE",   
  password: "DB_PASSWORD",
  connectionString: process.env.DATABASE_URL, // provided by Render
  ssl: { rejectUnauthorized: false }          // needed for Render                
});

export const checkConnection = async() => {
     try{
           const conn = await pool.connect();
           console.log("Connected to database");
           conn.release();
     }
     catch(err){
         console.log("Connection failed : ",err);
     }
}

