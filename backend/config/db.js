import mysql from "mysql2/promise";


const {HOST,DATABASE,USER,PASSWORD} = process.env;
const db_info = {
    host : HOST,
    database : DATABASE,
    user : USER,
    password : PASSWORD
}

export const pool = mysql.createPool(db_info);

export const checkConnection = async() => {
    try {
        const conn = await pool.getConnection();
        console.log("Database Connected......");
        conn.release();
    }
    catch(err) {
        console.log("connection failed : ",err);
    }
}