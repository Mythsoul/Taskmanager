import express from "express";
import dotenv from "dotenv"; 
import pg from "pg"; 
import path from "path"; 
import { fileURLToPath } from "url"; 

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/register', (req, res) => {
    res.render('register.ejs');
}); 

app.get("/login" , (req, res) => {
    res.render('login.ejs');
});

app.get("/dashboard" , (req, res) => {
    res.render('dashboard.ejs');
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
