
document.addEventListener("DOMContentLoaded", async () => {
  const add_task_btn = document.getElementById("add_task_btn");
  const add_task_dialog = document.getElementById("taskDialog");
  const add_task_form = document.getElementById("taskForm");
   const cancel_form_submission = document.getElementById("cancelBtn");
   
 
   let taskid = null;

    const update_task_dialog = document.getElementById("editTaskDialog");
   const update_task_form = document.getElementById("editTaskForm");
   const update_task_btn = document.querySelectorAll("#update-task-btn");
   update_task_btn.forEach((btn) => {
     btn.addEventListener("click", () => {
       taskid = btn.getAttribute("data-task-id"); 
       update_task_dialog.showModal();
     });
   });

   update_task_form.addEventListener("submit", async () => {
     const task_name = document.getElementById("udtaskName").value;
     const due_date = document.getElementById("uddue-date").value;
     const priority = document.getElementById("udpriority").value;
     const task_id = taskid;
     const task = {
       taskName: task_name,
       due_date,
       priority,
       task_id
     };
     const response = await fetch("/update-task", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify(task)
     });
     if (response.ok) {
       alert("Task updated successfully");
     } else {
       alert("Failed to update task");
     }  
  
   });
  async function add_task() {
  add_task_btn.addEventListener("click" , async() => {
    add_task_dialog.showModal();  
   }); 
   cancel_form_submission.addEventListener("click" , async() => {
    add_task_dialog.close();
  
   }) ; 
  add_task_form.addEventListener("submit" , async()=>{ 
    const task_name = document.getElementById("taskName").value;
    const due_date = document.getElementById("due-date").value;
    const priority = document.getElementById("priority").value;
  const task = {
      taskName : task_name,
      due_date,
      priority
    };
    const response = await fetch("/add-task", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task)
    });
    if (response.ok) {
      alert("Task added successfully");
    } else {
      alert("Failed to add task");
    }
   }); 

 }; 
 add_task();  
 

   
    async function update_task_status(taskName, status , task_id) {
        try {
          const response = await fetch("/update-task-status",{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ taskName, status , task_id }),
          });
    
          if (response.ok) {
            alert("Task status updated successfully");
          } else {
            alert("Failed to update task status");
          }
         } catch (error) {
          console.error("Error updating task status:", error);
          alert("An error occurred while updating the task status.");
        }
      }
    
    });

