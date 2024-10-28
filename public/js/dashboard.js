

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
  
      let taskName = taskDiv.querySelector("p").textContent.trim(); 
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

async function fetchFunFact() {
    try {
      const response = await fetch('https://api.api-ninjas.com/v1/facts', {
        headers: {
          'X-Api-Key': "huhalalala",
        }
      });
      const data = await response.json();
      console.log(data);
      showFunFact(data[0].fact);
    } catch (error) {
      console.error("Error fetching fun fact:", error);
    }
  }

  fetchFunFact();


function showFunFact(fact) {
    const funFactPopup = document.getElementById('funFactPopup');
    const funFactText = document.getElementById('funFactText');
    funFactText.textContent = fact;
    funFactPopup.classList.add('visible');
    setTimeout(() => {
      funFactPopup.classList.remove('visible');
    }, 3000); 
  }

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


    function check_due_date() {
        const tasks = document.querySelectorAll(".task_div");
        tasks.forEach((task) => {
          const due_date = new Date(task.dataset.due_date);
          const today = new Date();
          if (due_date === today) {
            console.log(`Task ${task.dataset.taskName} is due today!`);
          }
        });
      }

      check_due_date(); 

 function get_task_detail(){ 
    
 }