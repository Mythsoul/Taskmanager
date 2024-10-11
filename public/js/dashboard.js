document.addEventListener("DOMContentLoaded", () => {
    const dialog = document.getElementById("taskDialog");
    const addTaskBtn = document.querySelector(".add-task");
    const cancelBtn = document.getElementById("cancelBtn");
  
    if (addTaskBtn && dialog && cancelBtn) {
      addTaskBtn.addEventListener("click", () => {
        dialog.showModal();
      });
  
      cancelBtn.addEventListener("click", () => {
        dialog.close();
      });
  
      document.getElementById("taskForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const taskName = document.getElementById("taskName").value;
        const taskDescription = document.getElementById("taskDescription").value;
  
        const response = await fetch("/add-task", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ taskName, taskDescription }),
        });
  
        if (response.ok) {
          alert("Task added successfully");
        } else {
          alert("Failed to add task");
        }
  
        dialog.close();
      });
    }
  });
  