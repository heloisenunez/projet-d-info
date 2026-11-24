const grid = document.getElementById("grid");
const monthYear = document.getElementById("monthYear");
const panel = document.getElementById("eventsPanel");
const panelDate = document.getElementById("panelDate");
const eventsList = document.getElementById("eventsList");
const eventTitle = document.getElementById("eventTitle");
const eventTime = document.getElementById("eventTime");

const now = new Date();
let currentMonth = now.getMonth();
let currentYear = now.getFullYear();

let evenements = JSON.parse(localStorage.getItem("evenements")) || {};
let jourSelectionne = null; // ex : "2026-11-10"

const monthNames = [
  "Janvier","Février","Mars","Avril","Mai","Juin",
  "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
];

function sauvegarder() {
  localStorage.setItem("evenements", JSON.stringify(evenements));
}

function cleDate(annee, mois, jour) {
  return annee + "-" +
    String(mois + 1).padStart(2, "0") + "-" +
    String(jour).padStart(2, "0");
}

function renderCalendar() {
  grid.querySelectorAll(".day").forEach(d => d.remove());

  monthYear.textContent = monthNames[currentMonth] + " " + currentYear;

  let firstDay = new Date(currentYear, currentMonth, 1).getDay();
  firstDay = (firstDay + 6) % 7;

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today = new Date();

  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement("span");
    blank.className = "day";
    grid.appendChild(blank);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement("span");
    cell.className = "day";
    cell.textContent = d;

    const cle = cleDate(currentYear, currentMonth, d);

    if (
      d === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    ) {
      cell.classList.add("today");
    }

    if (evenements[cle] && evenements[cle].length > 0) {
      cell.classList.add("has-events");
    }

    if (cle === jourSelectionne) {
      cell.classList.add("selected");
    }

    cell.addEventListener("click", () => {
      jourSelectionne = cle;
      renderCalendar();
      afficherPanneau();
    });

    grid.appendChild(cell);
  }
}

function afficherPanneau() {
  if (!jourSelectionne) return;

  const [a, m, j] = jourSelectionne.split("-").map(Number);
  panelDate.textContent = new Date(a, m - 1, j).toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });

  eventsList.innerHTML = "";
  const liste = (evenements[jourSelectionne] || [])
    .slice()
    .sort((x, y) => (x.heure || "").localeCompare(y.heure || ""));

  if (liste.length === 0) {
    const vide = document.createElement("li");
    vide.className = "empty";
    vide.textContent = "Aucun événement ce jour-là.";
    eventsList.appendChild(vide);
  }

  liste.forEach(e => {
    const li = document.createElement("li");

    const texte = document.createElement("span");
    texte.textContent = (e.heure ? e.heure + " – " : "") + e.titre;

    const btn = document.createElement("button");
    btn.textContent = "✕";
    btn.setAttribute("aria-label", "Supprimer");
    btn.addEventListener("click", () => supprimerEvenement(e.id));

    li.append(texte, btn);
    eventsList.appendChild(li);
  });

  panel.hidden = false;
}

function ajouterEvenement() {
  const titre = eventTitle.value.trim();
  if (!titre || !jourSelectionne) return;

  if (!evenements[jourSelectionne]) evenements[jourSelectionne] = [];
  evenements[jourSelectionne].push({
    id: Date.now(),
    titre: titre,
    heure: eventTime.value
  });

  sauvegarder();
  eventTitle.value = "";
  eventTime.value = "";
  renderCalendar();
  afficherPanneau();
}

function supprimerEvenement(id) {
  evenements[jourSelectionne] = evenements[jourSelectionne].filter(e => e.id !== id);
  if (evenements[jourSelectionne].length === 0) delete evenements[jourSelectionne];
  sauvegarder();
  renderCalendar();
  afficherPanneau();
}

document.getElementById("addEvent").addEventListener("click", ajouterEvenement);
eventTitle.addEventListener("keydown", (e) => {
  if (e.key === "Enter") ajouterEvenement();
});

document.getElementById("prev").addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) { currentMonth = 11; currentYear--; }
  renderCalendar();
});

document.getElementById("next").addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  renderCalendar();
});

renderCalendar();