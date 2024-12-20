import express from "express"; 

import { database as db } from "../config/db.js";
import { get_reports } from "../models/reports.js";

export const delete_report = async (req, res) => { 
    const report_id = req.body.report_id;
    console.log("Report ID:", report_id);
    const user_id = req.user.id; 
    try { 
        const result = await db.query("DELETE FROM reports WHERE report_id = $1 AND user_id = $2", [report_id, user_id]); 
        if (result.rowCount === 0) { 
         res.status(404).send("Report not found");
            return;
        } 
        res.status(200).send("Report deleted successfully");
    } catch (err) { 
        console.error("Error deleting report:", err); 
        res.status(500).send("Failed to delete report");
    } 
};

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

export const update_report = async (req , res) => {
    const user_id = req.user.id;
const { report_title, report_description , report_id} = req.body;
   console.log(req.body);
    try {
    const result = await db.query(
        "UPDATE reports SET report_title = $1, report_description = $2 WHERE report_id = $3 and user_id = $4 RETURNING *",
        [report_title, report_description, report_id , user_id]
    );

    if (result.rowCount > 0) {
        return res.status(200).json({ message: "Report updated successfully." });
    } else {
        return res.status(404).json({ message: "Report not found." });
    }   
 } catch (err) {    
    console.error("Error in update_report:", err);  
    return res.status(500).json({ message: "Internal server error" });
 }
}; 

export const render_reports_page = async(req, res) => {
    const user = req.user;
    console.log(user);
    try {
        const reports = await get_reports(user.id);
        res.render("reports.ejs", {
            user: user,
            reports: reports,
        });
    } catch (err) {
        console.error("Error loading dashboard:", err);
        res.status(500).send("Failed to load dashboard");
    }
};