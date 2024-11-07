import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { database as db } from "./db.js";
dotenv.config();

passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async function (accessToken, refreshToken, profile, cb) {
        const id = profile.id.trim();
        const username = profile.displayName.trim();
        const hashedPassword = bcrypt.hashSync(id, 10);
  
        const picture = profile.photos[0].value;
  
        try {
          const userResult = await db.query(`SELECT * FROM users WHERE id = $1`, [id]);
  
          if (userResult.rows.length > 0) {
           const user = await userResult.rows[0];
  
            const taskResult = await db.query(`SELECT * FROM tasks WHERE user_id = $1`, [id]);
  
            if (taskResult.rows.length === 0) {
              await db.query(
                `INSERT INTO tasks (user_id, task_name , due_date , status , priority) VALUES ($1, $2 , $3 , $4 , $5)`,
                [id, 'Sample task' , new Date().toISOString().split('T')[0] , 'todo' , 'low']
              );
            }
            return cb(null, { id, username, picture });
          } else {
            const addUser = await db.query(
              `INSERT INTO users (id, username, password) VALUES ($1, $2, $3) RETURNING *`,
              [id, username, hashedPassword]
            );
  
            const newUser = addUser.rows[0];
  
            await db.query(
              `INSERT INTO tasks (user_id, task_name , due_date , status , priority) VALUES ($1, $2 , $3 , $4 , $5)`,
              [id, "Sample task" , new Date().toISOString().split('T')[0] , 'todo' , 'low']
            );
            return cb(null, { id, username, picture });
          }
        } catch (err) {
          return cb(err);
        }
      }
    )
  );
  
  
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  export default passport;