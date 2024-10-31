import express from "express";
import dotenv from "dotenv";
import pg from "pg";
import path from "path";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { database } from "./src/config/db.js";
import { fileURLToPath } from "url";
import session from "express-session";
import { add_task, delete_task, update_task_status, render_task , api_render_tasks  ,render_tasks_page , generateTaskSuggestions} from "./src/models/Task.js";
import {
  renderlogin,
  renderregister,
  google_auth,
  google_callback,
  renderlogout,
} from "./src/routes/authRoutes.js";
import { fetchFunFact } from "./src/models/fun.js";
import connectPgSimple from "connect-pg-simple";
import { render_homepage , render_dashboard} from "./src/routes/userRoutes.js";
import { add_report , scheduleMeeting } from "./src/models/quick-action.js";
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



app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.get("/", render_homepage);

app.get("/login", renderlogin);

app.get("/register", renderregister);

app.get("/auth/google", google_auth);

app.get(
  "/auth/google/dashboard", google_callback)

app.get("/dashboard", checkAuthenticated, render_dashboard);
app.route('/logout')
    .get (renderlogout)

  

app.post("/add-task", checkAuthenticated ,  add_task);

app.post("/update-task-status", checkAuthenticated,  update_task_status);

app.get("/api/user-tasks" , checkAuthenticated ,  api_render_tasks);
app.get("/user-tasks", checkAuthenticated , render_tasks_page)
app.post("/delete-task", checkAuthenticated,  delete_task);

app.post("/createreport" , checkAuthenticated , add_report);

app.post("/scheduleMeeting" , checkAuthenticated , scheduleMeeting);

// app.get("/test" , checkAuthenticated , async(req, res) => {
//   const user = req.user;
//    try{
//     const tasks = await render_task(user.id);
    
//     const tasks_suggestions = await generateTaskSuggestions(user.id); 
//     res.render("testui", {
//       user: user,
//       tasks: tasks,
//       tasks_suggestions: tasks_suggestions
//     });
//   } catch (err) {
//     console.error("Error loading dashboard:", err);
//     res.status(500).send("Failed to load dashboard");
//   }
// })
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


