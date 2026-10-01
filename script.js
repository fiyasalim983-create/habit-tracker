/* -----------------------------
   THEME
----------------------------- */

function applySavedTheme() {

  const isDark =
    localStorage.getItem("darkMode") === "true";

  if (isDark) {
    document.body.classList.add("dark-mode");
  }

}

/* Apply theme when any page loads */
applySavedTheme();

  /* -----------------------------
     DATA
  ----------------------------- */

const defaultHabits = [];

  let habits = JSON.parse(
    localStorage.getItem("habits")
  ) || defaultHabits;

  let checked = JSON.parse(
    localStorage.getItem("habitChecks")
  ) || {};

  let currentDate = new Date();
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function changeMonth(direction) {

  currentDate.setMonth(
    currentDate.getMonth() + direction
  );

  renderCalendar();

}

function quickAddHabit() {
  const habit = prompt("Enter your new habit 🌷");

  if (!habit || !habit.trim()) {
    return;
  }

  const input = document.getElementById("habitInput");

  input.value = habit.trim();

  addHabit();

  input.value = "";
}
  /* -----------------------------
     SAVE DATA
  ----------------------------- */

  function saveData() {

    localStorage.setItem(
      "habits",
      JSON.stringify(habits)
    );

    localStorage.setItem(
      "habitChecks",
      JSON.stringify(checked)
    );

  }


  /* -----------------------------
     DATE FUNCTIONS
  ----------------------------- */

  function getDaysInMonth(year, month) {

    return new Date(
      year,
      month + 1,
      0
    ).getDate();

  }


  function formatDate(year, month, day) {

    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  }


  function goToToday() {

    currentDate = new Date();

    render();

  }


  /* -----------------------------
     RENDER TABLE
  ----------------------------- */

  function render() {

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthName = currentDate.toLocaleString(
      "default",
      {
        month: "long",
        year: "numeric"
      }
    );

    document.getElementById("monthTitle").textContent =
      monthName;


    const days = getDaysInMonth(year, month);

    const table = document.getElementById("habitTable");

    table.innerHTML = "";


    /* Header */

    let headerRow = document.createElement("tr");

    let habitHeader = document.createElement("th");

    habitHeader.textContent = "Habits";

    habitHeader.className = "habit-column";

    headerRow.appendChild(habitHeader);


    for (let day = 1; day <= days; day++) {

      const date = new Date(year, month, day);

      const th = document.createElement("th");

      const weekday = date.toLocaleDateString(
        "en-US",
        { weekday: "short" }
      );

      th.innerHTML = `
        <div class="day-number">${day}</div>
        <div class="weekday">${weekday}</div>
      `;


      /* Highlight today */

      const today = new Date();

      if (
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear()
      ) {

        th.classList.add("today");

      }


      headerRow.appendChild(th);

    }


    table.appendChild(headerRow);


    /* Habit rows */

    habits.forEach((habit, habitIndex) => {

      const row = document.createElement("tr");


      const habitCell = document.createElement("td");

      habitCell.className =
        "habit-column habit-cell";


      habitCell.innerHTML = `
        <span class="habit-name">
          ${escapeHTML(habit)}
        </span>

        <button
          class="delete-btn"
          onclick="deleteHabit(${habitIndex})"
          title="Delete habit"
        >
          🗑️
        </button>
      `;


      row.appendChild(habitCell);


      for (let day = 1; day <= days; day++) {

        const cell = document.createElement("td");

        const dateKey =
          formatDate(year, month, day);


        const checkbox =
          document.createElement("input");

        checkbox.type = "checkbox";


        const checkKey =
          `${habitIndex}-${dateKey}`;


        checkbox.checked =
          checked[checkKey] === true;


        checkbox.addEventListener(
          "change",
          function () {

            if (this.checked) {

              checked[checkKey] = true;

            } else {

              delete checked[checkKey];

            }

            saveData();

            updateStats();

          }
        );


        const today = new Date();

        if (
          day === today.getDate() &&
          month === today.getMonth() &&
          year === today.getFullYear()
        ) {

          cell.classList.add("today");

        }


        cell.appendChild(checkbox);

        row.appendChild(cell);

      }


      table.appendChild(row);

    });


    updateStats();

  }


  /* -----------------------------
     ADD HABIT
  ----------------------------- */

  function addHabit() {

    const input =
      document.getElementById("habitInput");

    const habit =
      input.value.trim();


    if (!habit) {

      alert("Please enter a habit 🌷");

      return;

    }


    habits.push(habit);

    input.value = "";

    saveData();

    render();

  }


  /* Enter key */

const habitInput = document.getElementById("habitInput");

if (habitInput) {
  habitInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      addHabit();
    }
  });
}


  /* -----------------------------
     DELETE HABIT
  ----------------------------- */

  function deleteHabit(index) {

    const habitName = habits[index];

    const confirmed =
      confirm(
        `Delete "${habitName}"?`
      );


    if (!confirmed) return;


    habits.splice(index, 1);

    saveData();

    render();

  }


  /* -----------------------------
     STATISTICS
  ----------------------------- */

function updateStats() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const days = getDaysInMonth(year, month);

  const totalPossible = habits.length * days;

  let completed = 0;

  // Count completed habits
  for (let habitIndex = 0; habitIndex < habits.length; habitIndex++) {
    for (let day = 1; day <= days; day++) {
      const key = `${habitIndex}-${formatDate(year, month, day)}`;

      if (checked[key]) {
        completed++;
      }
    }
  }

  // Calculate today's percentage
  let todayCompleted = 0;

  const todayKey = formatDate(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );

  habits.forEach((habit, habitIndex) => {

    const key = `${habitIndex}-${todayKey}`;

    if (checked[key]) {
      todayCompleted++;
    }

  });

  let percentage = 0;

  if (habits.length > 0) {
    percentage = Math.round(
      (todayCompleted / habits.length) * 100
    );
  }

const completionStat =
  document.getElementById("completionStat");

if (completionStat) {
  completionStat.textContent = percentage + "%";
}

// Progress circle percentage
const progressText =
  document.getElementById("progressText");

if (progressText) {
  progressText.textContent = percentage + "%";
}

const progressCircle =
  document.querySelector(".progress-circle");

if (progressCircle) {
  const degrees = percentage * 3.6;

  progressCircle.style.background =
    `conic-gradient(
      #b87591 ${degrees}deg,
      #3a2b36 ${degrees}deg
    )`;
}

  // Best day
  let bestDay = 0;

  for (let day = 1; day <= days; day++) {
    let dayCompleted = 0;

    habits.forEach((habit, habitIndex) => {
      const key =
        `${habitIndex}-${formatDate(year, month, day)}`;

      if (checked[key]) {
        dayCompleted++;
      }
    });

    if (dayCompleted > bestDay) {
      bestDay = dayCompleted;
    }
  }

const bestDayStat =
  document.getElementById("bestDayStat");

if (bestDayStat) {
  bestDayStat.textContent =
    `${bestDay}/${habits.length}`;
}
updatePlantProgress(percentage);
updateScoreGraphs();

}



  /* -----------------------------
     START APP
  ----------------------------- */

const dailyQuotes = [
  "Small steps still count. ♡",
  "Be gentle with yourself.",
  "Progress, not perfection.",
  "You are doing your best.",
  "One day at a time.",
  "Keep showing up for yourself."
];

function showDailyQuote() {
  const today = new Date();
  const dayIndex = today.getDate() % dailyQuotes.length;

  document.getElementById("dailyQuote").textContent =
    `"${dailyQuotes[dayIndex]}"`;
}
// App Navigation

function showSection(section, button) {
  const buttons = document.querySelectorAll(".app-nav button");

  buttons.forEach(btn => {
    btn.classList.remove("nav-active");
  });

  button.classList.add("nav-active");

  if (section === "home") {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  if (section === "habits") {
    document.querySelector(".tracker-wrapper")
      .scrollIntoView({
        behavior: "smooth"
      });
  }

  if (section === "calendar") {
    document.querySelector(".controls")
      .scrollIntoView({
        behavior: "smooth"
      });
  }

}
/* -----------------------------
   DAILY TO-DO LIST
----------------------------- */

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


/* -----------------------------
   GET TODAY'S DATE
----------------------------- */

function getTodayDate() {

  const today = new Date();

  return `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(
    today.getDate()
  ).padStart(2, "0")}`;

}
// Give older tasks today's date
tasks = tasks.map(task => ({
  ...task,
  date: task.date || getTodayDate()
}));

localStorage.setItem(
  "tasks",
  JSON.stringify(tasks)
);

/* -----------------------------
   ADD TASK
----------------------------- */

function addTask() {

  const input = document.getElementById("taskInput");

  const taskText = input.value.trim();

  if (taskText === "") {

    alert("Please enter a task 🤍");

    return;

  }


  tasks.push({

    text: taskText,

    completed: false,

    date: getTodayDate()

  });


  localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
  );


  input.value = "";

  renderTasks();

}


/* -----------------------------
   RENDER TODAY'S TASKS
----------------------------- */

function renderTasks() {

  const taskList =
    document.getElementById("taskList");

  if (!taskList) return;


  taskList.innerHTML = "";


  const today = getTodayDate();


  const todayTasks = tasks.filter(
    task => task.date === today
  );


  todayTasks.forEach((task) => {

    const originalIndex =
      tasks.indexOf(task);


    const li =
      document.createElement("li");


    li.innerHTML = `

      <label>

        <input
          type="checkbox"
          ${task.completed ? "checked" : ""}
          onchange="toggleTask(${originalIndex})"
        >

        <span class="${
          task.completed ? "completed" : ""
        }">

          ${escapeHTML(task.text)}

        </span>

      </label>

      <button
        onclick="deleteTask(${originalIndex})"
      >
        🗑️
      </button>

    `;


    taskList.appendChild(li);

  });

}


/* -----------------------------
   TOGGLE TASK
----------------------------- */

function toggleTask(index) {

  tasks[index].completed =
    !tasks[index].completed;


  localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
  );


  renderTasks();

}


/* -----------------------------
   DELETE TASK
----------------------------- */

function deleteTask(index) {

  tasks.splice(index, 1);


  localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
  );


  renderTasks();

}

if (document.getElementById("taskList")) {
  renderTasks();
}

if (document.getElementById("dailyQuote")) {
  showDailyQuote();
}

if (document.getElementById("habitTable")) {
  render();
}

if (document.getElementById("progressText")) {
  updateStats();
}

function renderCalendar() {

  const calendarMonth =
    document.getElementById("calendarMonth");

  const calendarGrid =
    document.getElementById("calendarGrid");

  if (!calendarMonth || !calendarGrid) {
    return;
  }

 const date = currentDate;

  const year = date.getFullYear();
  const month = date.getMonth();

  const monthName = date.toLocaleString("default", {
    month: "long"
  });

  calendarMonth.textContent =
    `${monthName} ${year}`;

  const firstDay =
    new Date(year, month, 1).getDay();

  const daysInMonth =
    new Date(year, month + 1, 0).getDate();

  calendarGrid.innerHTML = "";

  const weekdays = [
    "Sun", "Mon", "Tue", "Wed",
    "Thu", "Fri", "Sat"
  ];

  weekdays.forEach(day => {

    const dayElement =
      document.createElement("div");

    dayElement.className = "calendar-weekday";
    dayElement.textContent = day;

    calendarGrid.appendChild(dayElement);

  });

  for (let i = 0; i < firstDay; i++) {

    const emptyDay =
      document.createElement("div");

    emptyDay.className = "calendar-empty";

    calendarGrid.appendChild(emptyDay);

  }

for (let day = 1; day <= daysInMonth; day++) {

  const dayElement =
    document.createElement("div");

  dayElement.className = "calendar-day";
  dayElement.textContent = day;

  // Calculate this day's habit completion
  let completedHabits = 0;

  habits.forEach((habit, habitIndex) => {

    const key =
      `${habitIndex}-${formatDate(year, month, day)}`;

    if (checked[key]) {
      completedHabits++;
    }

  });

  let completionPercentage = 0;

  if (habits.length > 0) {
    completionPercentage =
      Math.round(
        (completedHabits / habits.length) * 100
      );
  }

  // Add completion class
  if (completionPercentage === 100) {

    dayElement.classList.add("fully-completed");

  } else if (completionPercentage > 0) {

    dayElement.classList.add("partially-completed");

  }

  // Highlight today
  const today = new Date();

  if (
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear()
  ) {
    dayElement.classList.add("today");
  }

  calendarGrid.appendChild(dayElement);

}

}

if (document.getElementById("calendarGrid")) {
  renderCalendar();
}




/* -----------------------------
   DAILY & WEEKLY LINE GRAPHS
----------------------------- */

function drawLineGraph(canvasId, labels, scores, title) {

  const canvas = document.getElementById(canvasId);

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  const dpr = window.devicePixelRatio || 1;

  canvas.width = width * dpr;
  canvas.height = height * dpr;

  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, width, height);

  const padding = {
    top: 25,
    right: 15,
    bottom: 30,
    left: 35
  };

  const graphWidth =
    width - padding.left - padding.right;

  const graphHeight =
    height - padding.top - padding.bottom;

// Background

const isDark =
  document.body.classList.contains("dark-mode");

ctx.fillStyle =
  isDark ? "#3a3039" : "#fffaf4";

ctx.fillRect(0, 0, width, height);

// Grid lines

ctx.strokeStyle =
  isDark ? "#514450" : "#eadbd2";

ctx.lineWidth = 1;

ctx.fillStyle =
  isDark ? "#d8cbd2" : "#8f7b72";

  ctx.font = "10px Arial";

  ctx.textAlign = "right";

  for (let i = 0; i <= 4; i++) {

    const y =
      padding.top + (graphHeight / 4) * i;

    const value = 100 - i * 25;

    ctx.beginPath();

    ctx.moveTo(padding.left, y);

    ctx.lineTo(width - padding.right, y);

    ctx.stroke();

    ctx.fillText(value, padding.left - 8, y + 3);

  }

  if (scores.length === 0) return;

  // Graph line

  ctx.strokeStyle = "#b87591";

  ctx.lineWidth = 2.5;

  ctx.lineJoin = "round";

  ctx.lineCap = "round";

  ctx.beginPath();

  scores.forEach((score, index) => {

    const x =
      padding.left +
      (scores.length === 1
        ? graphWidth / 2
        : (index / (scores.length - 1)) * graphWidth);

    const y =
      padding.top +
      graphHeight -
      (score / 100) * graphHeight;

    if (index === 0) {

      ctx.moveTo(x, y);

    } else {

      ctx.lineTo(x, y);

    }

  });

  ctx.stroke();

  // Points

  scores.forEach((score, index) => {

    const x =
      padding.left +
      (scores.length === 1
        ? graphWidth / 2
        : (index / (scores.length - 1)) * graphWidth);

    const y =
      padding.top +
      graphHeight -
      (score / 100) * graphHeight;

    ctx.beginPath();

    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
// X-axis labels

ctx.fillStyle =
  isDark ? "#d8cbd2" : "#8f7b72";

    ctx.fill();

  });


ctx.font = "12px Arial";

  ctx.textAlign = "center";

  labels.forEach((label, index) => {

    const x =
      padding.left +
      (labels.length === 1
        ? graphWidth / 2
        : (index / (labels.length - 1)) * graphWidth);

    ctx.fillText(
      label,
      x,
      height - 10
    );

  });

}
/* -----------------------------
   CONNECT SCORE GRAPHS
----------------------------- */

function updateScoreGraphs() {

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = new Date(year, month + 1, 0).getDate();

  let dailyScores = [];
  let dailyLabels = [];

  for (let day = 1; day <= days; day++) {

    let completed = 0;

    habits.forEach((habit, index) => {

      const key = `${index}-${formatDate(year, month, day)}`;

      if (checked[key]) {
        completed++;
      }

    });

    const score = habits.length > 0
      ? Math.round((completed / habits.length) * 100)
      : 0;

    dailyScores.push(score);
    dailyLabels.push(day.toString());

  }

  drawLineGraph(
    "dailyScoreGraph",
    dailyLabels,
    dailyScores,
    "Daily Score"
  );
// WEEKLY SCORE

let weeklyScores = [];
let weeklyLabels = [];

const monthName = new Date(
  year,
  month,
  1
).toLocaleDateString("en-IN", {
  month: "short"
});

for (let week = 0; week < 5; week++) {

  const startDay = week * 7 + 1;
  const endDay = Math.min(startDay + 6, days);

  let totalScore = 0;
  let count = 0;

  for (let day = startDay; day <= endDay; day++) {

    let completed = 0;

    habits.forEach((habit, index) => {

      const key =
        `${index}-${formatDate(year, month, day)}`;

      if (checked[key]) {
        completed++;
      }

    });

    const score = habits.length > 0
      ? Math.round((completed / habits.length) * 100)
      : 0;

    totalScore += score;
    count++;
  }

  weeklyScores.push(
    count > 0
      ? Math.round(totalScore / count)
      : 0
  );

  weeklyLabels.push(
    `${startDay}–${endDay} ${monthName}`
  );
}
  drawLineGraph(
    "weeklyScoreGraph",
    weeklyLabels,
    weeklyScores,
    "Weekly Score"
  );
}
// SHOW TODAY'S DATE

function showCurrentDate() {

const dateElement =
  document.getElementById("currentDate") ||
  document.getElementById("taskDate");

  if (!dateElement) return;

  const today = new Date();

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  };

  dateElement.textContent =
    today.toLocaleDateString("en-IN", options);

}

showCurrentDate();
/* -----------------------------
   PLANT GROWTH ANIMATION
----------------------------- */

function updatePlantProgress(percentage) {

  const plant =
    document.querySelector(".botanical-flower svg");

  if (!plant) return;

  let growth = 0.65;

  if (percentage >= 25) {
    growth = 0.75;
  }

  if (percentage >= 50) {
    growth = 0.85;
  }

  if (percentage >= 75) {
    growth = 0.95;
  }

  if (percentage >= 100) {
    growth = 1;
  }

  plant.style.transform =
    `scale(${growth})`;

  plant.style.transformOrigin =
    "bottom center";

  plant.style.transition =
    "transform 0.5s ease";

}
/* -----------------------------
   TASK HISTORY
----------------------------- */

function showTaskHistory() {

  const history =
    document.getElementById("taskHistory");

  if (!history) return;

  history.innerHTML = "";

  const oldDates = [
    ...new Set(
      tasks
        .filter(task => task.date !== getTodayDate())
        .map(task => task.date)
    )
  ];

  if (oldDates.length === 0) {

    history.innerHTML =
      "<p>No previous tasks yet. 🤍</p>";

    return;
  }

  oldDates.sort().reverse();

  oldDates.forEach(date => {

    const dayTasks =
      tasks.filter(task => task.date === date);

    const section =
      document.createElement("div");

    section.innerHTML = `
      <h3>${date}</h3>
    `;

    dayTasks.forEach(task => {

      const item =
        document.createElement("p");

      item.innerHTML = `
        ${task.completed ? "☑️" : "⬜"}
        ${escapeHTML(task.text)}
      `;

      section.appendChild(item);

    });

    history.appendChild(section);

  });

}