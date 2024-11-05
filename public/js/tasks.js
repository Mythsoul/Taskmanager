
document.addEventListener("DOMContentLoaded", async () => {
  const add_task_btn = document.getElementById("add_task_btn");
  const add_task_dialog = document.getElementById("taskDialog");
 const add_task_form = document.getElementById("taskForm");
 const cancel_form_submission = document.getElementById("cancelBtn");
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

    async function get_tasks() {
        try {
            const response = await fetch("/api/user-tasks");
            const result = await response.json();
            const data = result.tasks;
          

            const tasks_div = document.querySelector(".user-tasks");
            const template = document.querySelector("#task-template");
            
            if (data && data.length > 0) {
                data.forEach(task => {
                    const taskElement = template.content.cloneNode(true);
                    const task_name = task.task_name; 
                    const taskText = taskElement.querySelector(".task-text");
                    const due_date = new Date(task.due_date).toLocaleDateString("default", {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });

                    taskText.textContent = `Task: ${task.task_name} - Due: ${due_date} \n Status : ${task.status}` ;


                    taskElement.querySelector(".status-pending").addEventListener("click", () => {
                      update_task_status(task_name, "pending");
                    });
                    taskElement.querySelector(".status-done").addEventListener("click", () => {
                       update_task_status(task_name, "done"); 
                    });

                    tasks_div.appendChild(taskElement);
                });
            } else {
                tasks_div.textContent = "No tasks found";
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    }

    get_tasks();
    async function update_task_status(taskName, status) {
        try {
          const response = await fetch("/update-task-status",{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ taskName, status }),
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



    const update_task_dialog = document.getElementById("updatetaskDialog");
    const update_task_form = document.getElementById("updateTaskForm");
    const update_task_btn = document.querySelectorAll(".update-task-btn");
    update_task_btn.forEach((btn) => {
      btn.addEventListener("click", () => {
        update_task_dialog.showModal();
      });
    update_task_form.addEventListener("submit", async () => {
      const task_name = document.getElementById("taskName").value;
      const due_date = document.getElementById("due-date").value;
      const priority = document.getElementById("priority").value;
      const task_id = btn.getAttribute("data-task-id");
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
    })
  }); 