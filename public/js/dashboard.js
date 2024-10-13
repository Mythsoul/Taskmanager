document.addEventListener("DOMContentLoaded", () => {
  const dialog = document.getElementById("taskDialog");
  const addTaskBtn = document.querySelector(".add-task");
  const cancelBtn = document.getElementById("cancelBtn");
  const taskForm = document.getElementById("taskForm");

  let timerInterval; 
  let reminderTime = 0; 

  // Task Dialog: Show/Hide Logic
  if (addTaskBtn && dialog && cancelBtn && taskForm) {
    addTaskBtn.addEventListener("click", () => {
      dialog.showModal();
    });

    cancelBtn.addEventListener("click", () => {
      dialog.close();
    });

    
    taskForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const taskName = document.getElementById("taskName").value;
      const taskDescription = document.getElementById("taskDescription").value;

      try {
        const response = await fetch("/add-task", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ taskName, taskDescription }),
        });

        if (response.ok) {
          alert("Task added successfully");
          location.reload();
        } else {
          alert("Failed to add task");
        }
      } catch (error) {
        console.error("Error adding task:", error);
        alert("An error occurred while adding the task.");
      }

      dialog.close();
    });
  }

  const timer_box = document.querySelector(".timer-box"); 
  const set_reminder = document.querySelector(".set-reminder");
  const currenttime = document.querySelector(".timer"); 
  const start_timer_btn = document.querySelector(".start-timer-btn"); 

  let time = 0; // Start from 0 seconds

  start_timer_btn.addEventListener("click", () => {
    if (start_timer_btn.textContent === "Start Pomodoro") {
      start_timer_btn.textContent = "Stop Pomodoro";
      timerInterval = setInterval(() => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;

        currenttime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        time++; 

        if (time === reminderTime) {
          alert("hi");
        }
      }, 1000);
    } else {
      clearInterval(timerInterval);
      start_timer_btn.textContent = "Start Pomodoro";
      currenttime.textContent = "00:00"; 
      time = 0; 
    }
  });

  set_reminder.addEventListener("click", () => {
    const time_limit = prompt("Enter time limit in minutes"); 
    if(time_limit){ 
      reminderTime = time_limit * 60;
    }
  });

  // Event Delegation for Task Status Buttons
  document.body.addEventListener("click", async (event) => {
    if (event.target.classList.contains("pending")) {
      const taskDiv = event.target.closest("div");
      const taskName = taskDiv.querySelector(".task_name").textContent;

      await updateTaskStatus(taskName, "pending");
      taskDiv.remove(); 
    }

    if (event.target.classList.contains("done")) {
      const taskDiv = event.target.closest("div");
      const taskName = taskDiv.querySelector(".task_name").textContent;

      await updateTaskStatus(taskName, "done");
      taskDiv.remove(); 
    }
  });

  // Function to update task status
  async function updateTaskStatus(taskName, status) {
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

  function handle_click() {
    const dialog_box = document.querySelector(".add-task-dialog");  
    const sumbit_btn = document.querySelector(".add-task-sumbit");
    dialog_box.addEventListener("keyup", (event) => {
      const pressed_key = event.key; 
      if (pressed_key === "Enter") {
        sumbit_btn.click();
      }
    });
  }; 

  handle_click();

})

