import session from "express-session";
import pg from "pg";
import connectPgSimple from "connect-pg-simple";
import dotenv from "dotenv";
dotenv.config(); 
export const database = new pg.Pool({
    user : process.env.DB_USER, 
    host : process.env.DB_HOST,
    database : process.env.DB_NAME,
    password : process.env.DB_PASSWORD,
    port : process.env.DB_PORT
});

database.connect((err) => {
    if (err) {
        console.error('Failed to connect to database', err);
    } else {
        console.log("Connected to database");
    }
});

