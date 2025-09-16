import { Pool } from "pg";

const {DB_HOST,DB_USER,DB_PASSWORD,DB_DATABASE,INTERNAL_DATABASE_URL,DB_PORT} = process.env; 

export const pool = new Pool({
  connectionString: INTERNAL_DATABASE_URL, // provided by Render
  ssl: { rejectUnauthorized: false } ,      // needed for Render                
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

