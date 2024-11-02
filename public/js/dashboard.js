document.addEventListener("DOMContentLoaded", () => {
    const dialog = document.getElementById("taskDialog");
    const addTaskBtn = document.querySelector(".add-task-btn");
    const cancelBtn = document.getElementById("cancelBtn");
    const taskForm = document.getElementById("taskForm");
    const statusBtns = document.querySelectorAll(".status-btn");
    const funFactCloseBtn = document.getElementById('funfact-close-btn');
    const funFactSidebar = document.getElementById('funFactPopup');
    const notificationBtn = document.getElementById("notificationBtn");
    const notificationDiv = document.getElementById("notificationDiv");
    const notificationText = document.getElementById("notificationText");
    // const notificationBadge = document.getElementById("notificationBadge");
    const notificationCloseBtn = document.getElementById("notification-close-btn");
    const reportForm = document.getElementById("report_form");  // Moved inside DOMContentLoaded

    const report_dialog = document.getElementById("add_report_dialog");
    const add_report_btn = document.getElementById('add_report_btn');
    const close_report_dialog = document.getElementById('close_report_dialog');
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userMenu = document.getElementById('userMenu');

    const update_report = document.getElementById("update_report");
    const update_report_dailog = document.getElementById("updateReportDialog");
    const cancel_report_update = document.getElementById("cancel_report_update");
    const report_update_form = document.getElementById("updateReportForm");

    userMenuBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        userMenu.classList.toggle('hidden');
    });



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

    }
    async function showFunFact() {
        document.addEventListener("DOMContentLoaded", () => {
            const funFactCloseBtn = document.getElementById('funfact-close-btn');
            const funFactSidebar = document.getElementById('funFactPopup');
            funFactSidebar.classList.remove('hidden');
            setTimeout(() => {
                funFactSidebar.classList.add('hidden');
            }, 5000);
        })


    }

    showFunFact();

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
        console.log("report name : ", reportName + "\n" + "report description : " + reportDescription);

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
            } else {
                const error = await response.json();
                alert(`Failed to create report: ${error.message}`);
            }
        } catch (error) {
            console.error("Error creating report:", error);
        }
    }

    reportForm.addEventListener("submit", createReport);


    async function scheduleMeeting(event) {

        const scheduleMeetingDialog = document.getElementById("scheduleMeetingDialog");
        const scheduleMeetingBtn = document.getElementById("scheduleMeetingBtn");
        const scheduleMeetingForm = document.getElementById("scheduleMeetingForm");
        const cancelBtn = document.getElementById("cancelBtn");

        scheduleMeetingBtn.addEventListener("click", () => {
            scheduleMeetingDialog.showModal();
        });

        cancelBtn.addEventListener("click", () => {
            scheduleMeetingDialog.close();
        });

        scheduleMeetingForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const meetingTitle = document.getElementById("meetingTitle").value;
            const meetingDate = document.getElementById("meetingDate").value;
            const meetingTime = document.getElementById("meetingTime").value;
            const participants = document.getElementById("participants").value;

            try {
                const response = await fetch("/scheduleMeeting", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title: meetingTitle,
                        date: meetingDate,
                        time: meetingTime,
                        participants: participants.split(",").map(email => email.trim()),
                    }),
                });

                if (response.ok) {
                    alert("Meeting scheduled successfully!");
                    scheduleMeetingDialog.close();
                } else {
                    const error = await response.json();
                    alert(`Failed to schedule meeting: ${error.message}`);
                }
            } catch (error) {
                console.error("Error scheduling meeting:", error);
                alert("An error occurred while scheduling the meeting.");
            }
        });
    }

    scheduleMeeting(event);

    let report_id = null;  

    
    update_report.addEventListener("click", (event) => {
        report_id = event.target.getAttribute("data-report-id"); 
        update_report_dailog.showModal();
    });

    
    cancel_report_update.addEventListener("click", () => {
        update_report_dailog.close();
    });

 
    report_update_form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const reportTitle = document.getElementById("updatereportTitle").value;
        const reportDescription = document.getElementById("updatereportDescription").value;

        
        try {
            const response = await fetch(`/updatereport`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    report_id,
                    report_title: reportTitle,
                    report_description: reportDescription
                })
            });

            const result = await response.json();

            if (response.ok) {
                alert("Report updated successfully");
                update_report_dailog.close();
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error("Error updating report:", error);
            alert("Failed to update report");
        }
    });



const reportDropdown = document.querySelectorAll(".report-dropdown");
reportDropdown.forEach((dropdown) => {
    dropdown.addEventListener("click", () => {
        const dropdownContent = dropdown.nextElementSibling;
        if (dropdownContent.classList.contains("hidden")) {
            dropdownContent.classList.remove("hidden");
        } else {
            dropdownContent.classList.add("hidden");
        }
    });


})}); 