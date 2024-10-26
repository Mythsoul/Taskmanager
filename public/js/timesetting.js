document.getElementById("startTimer").addEventListener("click", () => {
  const workDuration = parseInt(document.getElementById("workDuration").value) || 25;
  const breakDuration = parseInt(document.getElementById("breakDuration").value) || 5;
  startPomodoro(workDuration, breakDuration);
});

function startPomodoro(workDuration, breakDuration) {
  const timerDisplay = document.querySelector(".timer");

  startCountdown(workDuration * 60, "Work", () => {
    alert("Time for a break!");
    startCountdown(breakDuration * 60, "Break", () => {
      alert("Break over! Time to work again.");
      startPomodoro(workDuration, breakDuration);
    });
  });

  function startCountdown(duration, phase, onComplete) {
    let time = duration;

    const countdown = setInterval(() => {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      time--;

      if (time < 0) {
        clearInterval(countdown);
        onComplete();
      }
    }, 1000);
  }
}

const columns = ["todoColumn", "inProgressColumn", "doneColumn"];
columns.forEach(id => {
  new Sortable(document.getElementById(id), {
    group: "tasks",
    animation: 150,
  });
});
