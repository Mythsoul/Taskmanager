import express from "express";
import { database as db } from "../config/db.js";
export async function  get_meetings(UserId) {
 const user_id = UserId;
 try{ 
    const response = await db.query("select * from schedule_meetings where user_id = $1", [user_id]);
    const meetings = response.rows;
    return meetings;
 }catch(error){
    console.error("Error fetching meetings:", error);
    return "error while fetching meetings";
 }
} 
