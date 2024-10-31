import express from "express";
import { database as db } from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

export const add_report = async (req, res) => { 
    const { report_name, report_description } = req.body;
    const user_id = req.user.id;

    if (!report_name || !report_description) {
        return res.status(400).json({ message: "Report name and description are required." });
    }

    try { 
        const check_reports_length = await db.query(
            "SELECT report_title FROM reports WHERE user_id = $1",
            [user_id]
        ); 

        if (check_reports_length.rows.length >= 5) {
            
            return res.status(400).json({ message: "You have reached the maximum number of reports." });

        }
        
        const checkReportExists = await db.query(
            "SELECT * FROM reports WHERE user_id = $1 AND report_title = $2",
            [user_id, report_name]
        );

        if (checkReportExists.rows.length > 0) {
            return res.status(400).json({ message: "Report already exists." });
        }

        // Insert new report if it doesn't already exist
        const result = await db.query(
            "INSERT INTO reports (user_id, report_title, report_description) VALUES ($1, $2, $3) RETURNING *",
            [user_id, report_name, report_description]
        );

        if (result.rowCount > 0) {
            return res.status(200).json({ message: "Report added successfully." });
        } else {
            return res.status(500).json({ message: "Failed to add report." });
        }
    } catch (err) { 
        console.error("Error in add_report:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
