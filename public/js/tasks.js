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
                    const taskText = taskElement.querySelector(".task-text");
                    const due_date = new Date(task.due_date).toLocaleDateString("default", {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });

                    taskText.textContent = `Task: ${task.task_name} - Due: ${due_date}`;


                    taskElement.querySelector(".status-pending").addEventListener("click", () => {
                        console.log(`Pending clicked for task: ${task.task_name}`);
                    });
                    taskElement.querySelector(".status-done").addEventListener("click", () => {
                        console.log(`Done clicked for task: ${task.task_name}`);
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
});
