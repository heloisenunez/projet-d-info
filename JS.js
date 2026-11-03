  const grid = document.getElementById("grid");
  const monthYear = document.getElementById("monthYear");
  const now = new Date();
  let currentMonth = now.getMonth();   // 0-based: 0 = January
  let currentYear = now.getFullYear();

  const monthNames = [
    "Janvier","Février","Mars","Avril","Mai","Juin",
    "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
  ];

  function renderCalendar() {
    // Clear previous day cells, keep the 7 day-name headers
    grid.querySelectorAll(".day").forEach(d => d.remove());

    monthYear.textContent = monthNames[currentMonth] + " " + currentYear;

    // Day of week for the 1st (0=Sun). Convert to Mon-start: Mon=0 … Sun=6
    let firstDay = new Date(currentYear, currentMonth, 1).getDay();
    firstDay = (firstDay + 6) % 7;

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();

    // Blank cells before the first day
    for (let i = 0; i < firstDay; i++) {
      const blank = document.createElement("span");
      blank.className = "day";
      grid.appendChild(blank);
    }

    // Day cells
    for (let d = 1; d <= daysInMonth; d++) {
      const cell = document.createElement("span");
      cell.className = "day";
      cell.textContent = d;

      if (
        d === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear()
      ) {
        cell.classList.add("today");
      }
      grid.appendChild(cell);
    }
  }

  document.getElementById("Précédent").addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar();
  });

  document.getElementById("Suivant").addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar();
  });

  renderCalendar();
