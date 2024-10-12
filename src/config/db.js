import pg from "pg";

export const database = new pg.Client({ 
    user: "postgres",
    host: "localhost",
    database: "Taskmanager",
    password: "123456",
    port: 5432

});
if (database) { 
    database.connect();
    console.log("connected to database");
}else{ 
    console.log("failed to connect to database");
}