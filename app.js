import express from "express";
import dotenv from "dotenv";
import pg from "pg";
import path from "path";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { database } from "./src/config/db.js";
import { fileURLToPath } from "url";
import session from "express-session" ; 
import { fetchFunFact } from "./src/models/fun.js";
import connectPgSimple from "connect-pg-simple";
import { render_homepage , render_dashboard} from "./src/routes/userRoutes.js";
import { add_report , scheduleMeeting } from "./src/models/quick-action.js";
import authRoutes from "./src/routes/authRoutes.js";
import taskRoutes from "./src/routes/taskRoutes.js";
import { ensureAuthenticated } from "./src/middlewares/authMiddleware.js";

const app = express();
const port = 3000;

dotenv.config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

const PgSession = connectPgSimple(session);
 try{ app.use(
  session({
      store: new PgSession({
          pool: database, 
          tableName: "sessions",  
      }),
      secret: process.env.SESSION_SECRET || "keyboard cat",
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
  })
);
}catch(err){console.log(err);}


// Passport Stuff : 

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");


// User Routes : 
app.get("/", render_homepage);
app.get("/dashboard", ensureAuthenticated,  render_dashboard);

// Task Routes :
app.use(taskRoutes);

// Auth Routes :
app.use(authRoutes);

// Quick Action Routes : 

app.post("/createreport" , ensureAuthenticated , add_report);

app.post("/scheduleMeeting" , ensureAuthenticated , scheduleMeeting);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


