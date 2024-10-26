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
              alert("Task added successfully");
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

  taskForm.addEventListener("submit", addTask);




  statusBtns.forEach((statusBtn) => {
    statusBtn.addEventListener("click", async (event) => {
      const taskDiv = event.target.closest(".task_div");
      if (!taskDiv) return;
  
      let taskName = taskDiv.querySelector("p").textContent.trim().toLowerCase(); 
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
