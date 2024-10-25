document.addEventListener("DOMContentLoaded", async() => {
    const data = await fetch("/api/user-tasks");
    console.log(data); 
})