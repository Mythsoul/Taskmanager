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
          console.log(tasks);
          const reports = await get_reports(user.id);
          const meetingsData = await get_meetings(user.id);
  
        
          const meetings = meetingsData.map(meeting => ({
              title: meeting.title,
              date: new Date(meeting.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
              }),
              time: meeting.time
          }));
  
        
          res.render("dashboard", {
              user: user,
              tasks: tasks,
              reports: reports, 
              meeting: { meetings },  
              funfact: await fetchFunFact(),
          });
      } catch (err) {
          console.error("Error loading dashboard:", err);
          res.status(500).send("Failed to load dashboard");
      }
  };
  
export const render_usermenu = async (req, res) => {
    const user = req.user
    res.render("usermenu.ejs" , { user : user})
}
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
