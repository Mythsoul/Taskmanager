-- User Table which contains id username and password

CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
)

-- Task table which contains id user_id task_name due_date created_at status and priority

CREATE TABLE tasks
(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    task_name VARCHAR(255) NOT NULL,
    due_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(255) NOT NULL,
    priority VARCHAR(255) NOT NULL
)

-- sessions table which stores your session 

CREATE TABLE "sessions" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "sessions" ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "sessions" ("expire");

-- u can find this in connectpg simple / tables.sql file 