import pg from "pg";

export const database = new pg.client({ 
    user: "postgres",
    host: "localhost",
    database: "taskmanager",
    password: "123456",
    port: 5432

});
