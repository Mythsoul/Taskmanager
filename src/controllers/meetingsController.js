import express from "express";
import { get_meetings } from "../models/schedule-meeting.js";

export const render_meetingpage = async (req , res)=>{ 
    const user = req.user;
    const meeting = await get_meetings(user.id); 
    console.log(meeting);
    try  { 
        res.render("meetings.ejs" , { 
            meetings : await meeting, 
            user :user,
        })
    }catch(err){ 
        throw err ; 
    }
}; 



