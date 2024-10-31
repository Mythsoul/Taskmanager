document.addEventListener("DOMContentLoaded", () => {
    const dialog = document.getElementById("taskDialog");
    const addTaskBtn = document.querySelector(".add-task-btn");
    const cancelBtn = document.getElementById("cancelBtn");
    const taskForm = document.getElementById("taskForm");
    const statusBtns = document.querySelectorAll(".status-btn");
    const funFactCloseBtn = document.getElementById('funfact-close-btn');
    const funFactSidebar = document.getElementById('funFactSidebar');
    const notificationBtn = document.getElementById("notificationBtn");
    const notificationDiv = document.getElementById("notificationDiv");
    const notificationText = document.getElementById("notificationText");
    const notificationBadge = document.getElementById("notificationBadge");
    const notificationCloseBtn = document.getElementById("notification-close-btn");
    const reportForm = document.getElementById("report_form");  // Moved inside DOMContentLoaded

    let notifications = [];

    // Notification button functionality
    notificationBtn.addEventListener("click", () => {
        notificationDiv.classList.toggle("hidden");
        notificationBadge.classList.add("hidden");
    });

    notificationCloseBtn.addEventListener("click", () => {
        notificationDiv.classList.add("hidden");
    });

    function addNotification(message) {
        const previousNotification = notificationText.textContent; 
        console.log("previous notification: " + previousNotification); 

        if (previousNotification) {
            notificationText.textContent = `${previousNotification}\n${message}`;
        } else {
            notificationText.textContent = message;
        }
        
        notificationBadge.classList.remove("hidden");
    }

    // Fun fact functionality
    funFactCloseBtn.addEventListener('click', () => {
        funFactSidebar.classList.add('hidden');
    });

    addTaskBtn.addEventListener("click", () => {
        dialog.showModal();
    });

    cancelBtn.addEventListener("click", () => {
        dialog.close();
    });

    const report_dialog = document.getElementById("add_report_dialog");
    const add_report_btn = document.getElementById('add_report_btn');
    const close_report_dialog = document.getElementById('close_report_dialog');

    add_report_btn.addEventListener('click', () => {
        report_dialog.showModal();
    });
    close_report_dialog.addEventListener('click', () => {
        report_dialog.close();
    });

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
                addNotification(`Added task: ${taskName}`);
                setTimeout(() => window.location.reload(), 2000);
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
            const [taskName, dueDateText] = taskDiv.innerText.split("Due Date: ").map(str => str.trim());
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

    async function deleteTasks() {
        const deleteTaskBtns = document.querySelectorAll('.delete-task-btn');
    
        deleteTaskBtns.forEach((btn) => {
            btn.addEventListener("click", async (event) => {
                const taskDiv = event.target.closest(".done_div");
                if (!taskDiv) return;
    
                const taskNameElement = taskDiv.querySelector("p");
                if (!taskNameElement) return;
    
                const taskName = taskNameElement.textContent.trim();
    
                try {
                    const response = await fetch("/delete-task", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ taskName }),
                    });
    
                    if (response.ok) {
                        taskDiv.remove();
                        showNotification(`Deleted task: ${taskName}`);
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
    
    deleteTasks();

    function requestNotificationPermission() {
        Notification.requestPermission().then((result) => {
            if (result === "granted") {
                console.log("Notification permission granted");
            } else if (result === "denied") {
                alert("You've blocked notifications. Please enable them in your browser settings to receive task reminders.");
            }
        });
    }

    requestNotificationPermission();

    function showNotification(message) {
        notificationText.textContent = message;
        notificationDiv.classList.remove('hidden');
        notificationBadge.classList.remove('hidden');
    }

    async function checkTaskDueDate() {
        const tasks = document.querySelectorAll(".todo_task_name");

        tasks.forEach((task) => {
            const taskName = task.innerText.trim();
            const dueDate = task.getAttribute("data-due-date");
            checkDueDate(dueDate, taskName);
        });
    }

    async function checkDueDate(dueDate, taskName) {
        const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

        if (currentDate === dueDate) {
            showNotification(`Today is the due date for task: ${taskName}`);
            new Notification("Task Reminder", {
                body: `Time to complete your task: ${taskName}`,
            });
        }
    }

    checkTaskDueDate();

    async function createReport(event) {
        event.preventDefault(); 
        
        const reportName = document.getElementById("report_name").value.trim();
        const reportDescription = document.getElementById("report_description").value.trim();
        console.log("report name : " , reportName + "\n" + "report description : " + reportDescription);

        if (!reportName || !reportDescription) {
            alert("Report name and description are required.");
            return;
        }

        try {
            const response = await fetch("/createreport", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ report_name: reportName, report_description: reportDescription }),
            });

            if (response.ok) {
                const message = await response.json();
                alert(message.messsage);
            }else{ 
                const error = await response.json();
                alert(`Failed to create report: ${error.message}`);
            }
        } catch (error) {
            console.error("Error creating report:", error);
        }
    }

    reportForm.addEventListener("submit", createReport);
});
