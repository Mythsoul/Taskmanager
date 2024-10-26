document.addEventListener("DOMContentLoaded", () => {
  const dialog = document.getElementById("taskDialog");
  const addTaskBtn = document.querySelector(".add-task-btn"); 
  const cancelBtn = document.getElementById("cancelBtn");
  const taskForm = document.getElementById("taskForm");

  addTaskBtn.addEventListener("click", () => {
    dialog.showModal();
  });

  cancelBtn.addEventListener("click", () => {
    dialog.close();
  });

  const addTask = async (e) => {
    e.preventDefault();
    const taskName = document.getElementById("taskName").value;
    const dueDate = document.getElementById("due-date").value;
    const currentDate = new Date().toISOString().split("T")[0];

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
        body: JSON.stringify({ taskName, due_date: dueDate }),
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
  };

  taskForm.addEventListener("submit", addTask);

  document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("fa-hourglass-half")) {
      const taskDiv = event.target.closest(".task_div");
      const taskName = taskDiv.querySelector("p").textContent;
      await updateTaskStatus(taskName, "pending");
      taskDiv.remove();
    }

    if (event.target.classList.contains("fa-check-circle")) {
      const taskDiv = event.target.closest(".task_div");
      const taskName = taskDiv.querySelector("p").textContent;
      await updateTaskStatus(taskName, "done");
      taskDiv.remove();
    }
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

  function handleKeyPress() {
    const submitBtn = document.querySelector("button[type='submit']");
    taskForm.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        submitBtn.click();
      }
    });
  }

  handleKeyPress();
});

