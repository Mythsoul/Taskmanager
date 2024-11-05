import express from "express";
import { fetchFunFact } from "../models/fun.js";
import { render_task  } from "../models/Task.js";
import { get_reports } from "../models/reports.js";
import { get_meetings } from "../models/schedule-meeting.js";
export const render_homepage = async(req ,res)=>{ 
        const funfact = await fetchFunFact(); 
        res.render("index.ejs" , {funfact : funfact});
    }
    export const render_dashboard = async (req, res) => { 
      const user = req.user;
      console.log(user);
  
      try {
          const tasks = await render_task(user.id);
          const reports = await get_reports(user.id);
          const meetingsData = await get_meetings(user.id);
  
          // Format each meeting's date and time for rendering
          const meetings = meetingsData.map(meeting => ({
              title: meeting.title,
              date: new Date(meeting.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
              }),
              time: meeting.time // Make sure meeting.time is in a readable format
          }));
  
          // Pass `meetings` as an array to the template
          res.render("dashboard", {
              user: user,
              tasks: tasks,
              reports: reports, 
              meeting: { meetings },  // This matches the expected structure in the template
              funfact: await fetchFunFact(),
          });
      } catch (err) {
          console.error("Error loading dashboard:", err);
          res.status(500).send("Failed to load dashboard");
      }
  };
  
// export const render_testpage = async(req ,res)=>{ 
//     const user = req.user;
//     console.log(user);
//     try {
//       const tasks = await render_task(user.id);
//       console.log(tasks);
//       const reports = await get_reports(user.id);
//       console.log(reports);
//       // const tasks_suggestions = await generateTaskSuggestions(user.id); 
//       res.render("test", {
//         user: user,
//         tasks: tasks,
//         reports: reports, 
//           funfact : await fetchFunFact(),
//       });
//     } catch (err) {
//       console.error("Error loading dashboard:", err);
//       res.status(500).send("Failed to test page");
//     }
// }
