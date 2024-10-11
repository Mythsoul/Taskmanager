import pg from "pg";

export const database = new pg.Client({ 
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD, 
    port: process.env.DB_PORT 

});
if (database) { 
    database.connect();
    console.log("connected to database");
}else{ 
    console.log("failed to connect to database");
}
