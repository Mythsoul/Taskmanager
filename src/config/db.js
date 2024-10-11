import pg from "pg";

export const database = new pg.Client({ 
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "Taskmanager",
    password: process.env.DB_PASSWORD || "123456",
    port: process.env.DB_PORT || 5432

});
if (database) { 
    database.connect();
    console.log("connected to database");
}else{ 
    console.log("failed to connect to database");
}
