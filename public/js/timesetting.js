document.addEventListener("DOMContentLoaded" , ()=>{ 
// GOT SOME ERROR FIXING IT LTR    
const timer_box = document.querySelector(".timer-box"); 
const set_reminder = document.querySelector(".set-reminder");
const currenttime = document.querySelector(".timer"); 

const start_timer_btn = document.querySelector(".start-timer-btn"); 
let reminderTime = 0;
let time = 0; 
let timerInterval;

start_timer_btn.addEventListener("click", () => {
  if (start_timer_btn.textContent === "Start Pomodoro") {
    start_timer_btn.textContent = "Stop Pomodoro";
    timerInterval = setInterval(() => {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;

      currenttime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      time++; 

      if (time === reminderTime) {
        alert("Time's up! You have reached ur time limit !");
        clearInterval(timerInterval);
        start_timer_btn.textContent = "Start Pomodoro";
        time = 0;
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
 const time_limit = prompt("Enter the time limit in minutes");
 console.log("Time_limit_recived " + time_limit);
 reminderTime = time_limit * 60;
 start_timer_btn.click(); 
});
}); 
