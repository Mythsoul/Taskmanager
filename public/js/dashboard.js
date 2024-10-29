
document.addEventListener("DOMContentLoaded", () => {
   

  const dialog = document.getElementById("taskDialog");
  const addTaskBtn = document.querySelector(".add-task-btn");
  const cancelBtn = document.getElementById("cancelBtn");
  const taskForm = document.getElementById("taskForm");
  const statusBtns = document.querySelectorAll(".status-btn"); 
  


  addTaskBtn.addEventListener("click", () => {
      dialog.showModal();
  });

  cancelBtn.addEventListener("click", () => {
      dialog.close();
  });

  // Add task function
  const addTask = async (e) => {
      e.preventDefault();
      const taskName = document.getElementById("taskName").value;
      const dueDate = document.getElementById("due-date").value;
      const priority = document.getElementById("priority").value;
      const currentDate = new Date().toISOString().split("T")[0];

      if (!taskName || !dueDate) {
          alert("Please fill in all fields.");
          return;
      }

      if (dueDate < currentDate) {
          alert("Please set a valid due date.");
          return;
      }

      try {
          const response = await fetch("/add-task", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ taskName, due_date: dueDate, priority }),
          });

          if (response.ok) {
              location.reload(); // Reload to see the new task
          } else {
              const error = await response.json();
              alert(`Failed to add task: ${error.message}`);
          }
      } catch (error) {
          console.error("Error adding task:", error);
          alert("An error occurred while adding the task.");
      }

      dialog.close();
  };

  taskForm.addEventListener("submit", addTask , request_notificiaton());




  statusBtns.forEach((statusBtn) => {
    statusBtn.addEventListener("click", async (event) => {
      const taskDiv = event.target.closest(".task_div");
      if (!taskDiv) return;
     const [taskName, dueDateText] = taskDiv.innerText.split("Due Date : ").map(str => str.trim()); 
      console.log(taskName);
      const status = event.target.classList.contains("pending") ? "pending" : "done";
  
      await updateTaskStatus(taskName, status);
      taskDiv.remove();
    });
  });
   

  async function updateTaskStatus(taskName, status) {
      try {
          const response = await fetch("/update-task-status", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ taskName, status }),
          });

          if (!response.ok) {
              const error = await response.json();
              alert(`Failed to update task status: ${error.message}`);
          }
      } catch (error) {
          console.error("Error updating task status:", error);
          alert("An error occurred while updating the task status.");
      }
  }

  taskForm.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
          event.preventDefault();
          taskForm.dispatchEvent(new Event("submit"));
      }
  });
});





  function delete_task() { 
    const delete_task_btns = document.querySelectorAll(".delete-task-btn");

    delete_task_btns.forEach((btn) => {
        btn.addEventListener("click", async (event) => {
            console.log("Delete button clicked");
            const taskDiv = event.target.closest(".done_div");
            if (!taskDiv) return;
            const task_name = taskDiv.querySelector("p").textContent.trim();
            try {
                const response = await fetch("/delete-task", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ taskName: task_name }),
                });
                if (response.ok) {
                    taskDiv.remove();
                } else {
                    const error = await response.json();
                    alert(`Failed to delete task: ${error.message}`);
                }
            } catch (error) {
                console.error("Error deleting task:", error);
            }
        });
    });
}

delete_task();

function request_notificiaton() {
    Notification.requestPermission().then((result) => {
        if (result === "granted") {
            console.log("Notification permission granted");
            
        }if (Notification.permission === "denied") {
           
            alert("You've blocked notifications. Please enable them in your browser settings to receive task reminders.");
          } 
    })}

    request_notificiaton();



 
async function change_background() {
const toggle_button = document.querySelector("#darkModeToggle");
toggle_button.addEventListener("click", () => {
 console.log("clicked toggle button");
 document.body.classList.toggle("bg-white");
});
}
change_background();

 const funfact_div = document.querySelector(".fun-facts");
 funfact_div.style = "fun-facts fun-fact-sidebar";
 setTimeout(() => {
     funfact_div.attributes.style.value = "display: none;";

 } , 3000)

 const notificationBtn = document.getElementById('notificationBtn');
 const notificationDiv = document.getElementById('notificationDiv');

 notificationBtn.addEventListener('hover', () => {
    notificationDiv.classList.remove('hidden');
    setTimeout(() => {
        notificationDiv.classList.add('hidden');
    } , 2000)
 });

notificationBtn.addEventListener("click" ,  ()=>{ 
    notificationDiv.classList.remove('hidden');
})
const notificationcloseBtn = document.querySelector(".notification-close-btn");
notificationcloseBtn.addEventListener("click" , ()=>{ 
   notificationDiv.classList.add("hidden");
});
 

function check_task_due_date() {
    const task_name = document.querySelectorAll(".todo_task_name"); 

    task_name.forEach((taskElement) => {
        const text = taskElement.innerText;
        
        
        const [taskName, dueDateText] = text.split("Due Date : ").map(str => str.trim()); 
        console.log(taskName);
        console.log(dueDateText); 

        check_due_date(dueDateText , taskName);

    });
}



export async function check_due_date( dueDate  , taskName) {
    const notification_text = document.querySelector(".notification-text");
    const previous_notification_text = notification_text.textContent;

    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const currentDate = new Date().toLocaleDateString('en-US', options);
   console.log("current Date : " + currentDate);
   if (currentDate === dueDate) {
    console.log("Today is the due date of task " + taskName);

    notification_text.textContent = previous_notification_text +  "\n" + "Today is the due date of task " + taskName;
    new Notification("Task Reminder", {
        body: "Time to complete your task" + "\t" + taskName,
    });
} 
}
