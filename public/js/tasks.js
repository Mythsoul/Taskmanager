
document.addEventListener("DOMContentLoaded", async () => {
  const add_task_btn = document.getElementById("add_task_btn");
  const add_task_dialog = document.getElementById("taskDialog");
  const add_task_form = document.getElementById("taskForm");
  const cancel_form_submission = document.getElementById("cancelBtn");
 
  async function update_task_status() { 
      
 const pending_status_buttons = document.querySelectorAll("#status-pending-btn");
 pending_status_buttons.forEach ((button) => {
     button.addEventListener("click", async() => {
         const task_id = button.getAttribute("data-task-id");
      const response = await fetch("/update-task-status", {
         method: "POST",
         headers: {
             "Content-Type": "application/json",
         },
         body: JSON.stringify({ task_id, status: "Pending" }),
     }) 
   
        if (response.ok) {
            alert("Task status updated to Pending");
            window.location.reload();
        }else{
            alert("Failed to update task status");
        }
     })
 })

 const done_status_buttons = document.querySelectorAll("#status-done-btn");
 done_status_buttons.forEach((button) => {
     button.addEventListener("click", async() => {
         const task_id = button.getAttribute("data-task-id");
      const response = await fetch("/update-task-status", {
         method: "POST",
         headers: {
             "Content-Type": "application/json",
         },
         body: JSON.stringify({ task_id, status: "Done" }),
     })
        if (response.ok) {
            alert("Task status updated to Done");
            window.location.reload();
        }else{
            alert("Failed to update task status");
        }
     })
 });
  }
 update_task_status();
 async function delete_task(){ 
  const delete_task_btn = document.querySelectorAll("#delete_task_btn");
   delete_task_btn.forEach((btn) => {
     btn.addEventListener("click", async () => {
       const task_id = btn.getAttribute("data-task-id");
       const response = await fetch("/delete-task", {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({ task_id }),
       });
       if (response.ok) {
         alert("Task deleted successfully");
         window.location.reload();
       } else {
         alert("Failed to delete task");
       }
     });
   });
 }
delete_task(); 

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
 
 const pendingTasksButton = document.getElementById("pending_tasks");
 pendingTasksButton.addEventListener("click", () => {
     const tasks = document.querySelectorAll(".task-item");
     tasks.forEach((task) => {
         if (task.getAttribute("data-tasks-status") === "Pending") {
             task.style.display = "block";
         } else {
             task.style.display = "none";
         }
     });
 });

 const completedTasksButton = document.getElementById("completed_tasks");
 completedTasksButton.addEventListener("click", () => {
     const tasks = document.querySelectorAll(".task-item");
     tasks.forEach((task) => {
         if (task.getAttribute("data-tasks-status") === "Done") {
             task.style.display = "block";
         } else {
             task.style.display = "none";    
         }
     });
 });
 const alltasksButton = document.querySelector("#all_tasks");
 alltasksButton.addEventListener("click", () => {
     const tasks = document.querySelectorAll(".task-item");
     tasks.forEach((task) => {
         task.style.display = "block";
     });
 })


}); 