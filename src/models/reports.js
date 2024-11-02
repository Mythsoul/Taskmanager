import express from "express"; 
import { database as db } from "../config/db.js";
import dotenv from "dotenv"; 

dotenv.config(); 

export async function get_reports(userId) {
    try {
        const response = await db.query("SELECT * FROM reports WHERE user_id = $1", [userId]);
        const reports = response.rows;
        return reports;
    } catch (error) {
        console.error("Error fetching reports:", error);
        return "no reports found";
    }
};




