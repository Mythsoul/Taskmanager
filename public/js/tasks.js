
document.addEventListener("DOMContentLoaded", async () => {

    async function get_tasks() {
        try {
            const response = await fetch("/api/user-tasks");
            const result = await response.json();
            const data = result.tasks;
            console.log(data ?? "No data found");

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
          const response = await fetch("/update-task-status", {
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
