import express from "express";
import { get_meetings } from "../models/schedule-meeting.js";
import { database as db } from "../config/db.js";
export const render_meetingpage = async (req , res)=>{ 
    const user = req.user;
    const meeting = await get_meetings(user.id); 
    console.log(meeting);
    try  { 
        res.render("meetings.ejs" , { 
            meetings :  meeting, 
            user :user,
        })
    }catch(err){ 
        throw err ; 
    }
}; 

export const delete_meetings = async (req , res)=>{ 
    const meeting_id = req.body.meeting_id; 
    const user_id = req.user.id; 
    try { 
        const result = await db.query("DELETE FROM schedule_meetings WHERE meeting_id = $1 AND user_id = $2", [meeting_id, user_id]); 
        if (result.rowCount === 0) { 
            res.status(404).send("Meeting not found");
            return; }
        res.status(200).send("Meeting deleted successfully");
    } catch (err) { 
        console.error("Error deleting meeting:", err); 
        res.status(500).send("Failed to delete meeting");
     } 
};  

export const update_meetings = async (req , res)=>{
    const meeting_id = req.body.meeting_id; 
    const user_id = req.user.id; 
    try { 
        const {title, date, time , participants} = req.body;

        const result = await db.query(
          "UPDATE schedule_meetings SET title = $1, date = $2, time = $3, participants = $4 WHERE meeting_id = $5 AND user_id = $6", 
          [title, date, time, participants, meeting_id, user_id]
        );
        
        if (result.rowCount === 0) { 
            res.status(404).send("Meeting not found");
            return; }
        res.status(200).send("Meeting updated successfully");
    } catch (err) { 
        console.error("Error updating meeting:", err); 
        res.status(500).send("Failed to update meeting");
     }
}; 