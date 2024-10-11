document.addEventListener("DOMContentLoaded", () => {
  const dialog = document.getElementById("taskDialog");
  const addTaskBtn = document.querySelector(".add-task");
  const cancelBtn = document.getElementById("cancelBtn");
  const taskForm = document.getElementById("taskForm");

  // Task Dialog: Show/Hide Logic
  if (addTaskBtn && dialog && cancelBtn && taskForm) {
    addTaskBtn.addEventListener("click", () => {
      dialog.showModal();
    });

    cancelBtn.addEventListener("click", () => {
      dialog.close();
    });

    // Add Task Form Submission Logic
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
          location.reload(); // Reload the page to reflect the new task
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

  // Event Delegation for Task Status Buttons
  document.body.addEventListener("click", async (event) => {
    if (event.target.classList.contains("pending")) {
      const taskDiv = event.target.closest("div");
      const taskName = taskDiv.querySelector(".task_name").textContent;

      await updateTaskStatus(taskName, "pending");
      taskDiv.remove(); // Optionally remove task from UI after status change
    }

    if (event.target.classList.contains("done")) {
      const taskDiv = event.target.closest("div");
      const taskName = taskDiv.querySelector(".task_name").textContent;

      await updateTaskStatus(taskName, "done");
      taskDiv.remove(); // Optionally remove task from UI after status change
    }
  });
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
      // Optionally update UI to reflect the task status change (e.g., move task between columns)
    } else {
      alert("Failed to update task status");
    }
  } catch (error) {
    console.error("Error updating task status:", error);
    alert("An error occurred while updating the task status.");
  }
}; 

async function timer() {
  const currenttime = document.querySelector(".timer"); 
  const start_timer_btn = document.querySelector(".start-timer-btn"); 
  start_timer_btn.addEventListener("click", () => {
    currenttime.textContent = Date.now();
  })
}

timer(); 

