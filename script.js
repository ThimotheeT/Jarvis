//Meteo
const keyApi = "5ba96853b00f3258c8e7cb14e0a08260"
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lang=fr&units=metric&q=Paris`
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather() {

  const res = await fetch(apiUrl + `&appid=${keyApi}`)
  let data = await res.json();

  document.querySelector(".city").innerHTML = data.name;
  document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";

  if (data.weather[0].main == "Clouds") {
    weatherIcon.src = "/images/icone_brokencloud.png";
  }
  else if (data.weather[0].main == "Clear") {
    weatherIcon.src = "/images/icone_clair.png";
  }
  else if (data.weather[0].main == "Drizzle") {
    weatherIcon.src = "/images/icone_showerrain.png";
  }
  else if (data.weather[0].main == "Mist") {
    weatherIcon.src = "/images/icone_mist.png";
  }
  else if (data.weather[0].main == "Thunderstorm") {
    weatherIcon.src = "/images/icone_thunderstorm.png";
  }
  else if (data.weather[0].main == "Rain") {
    weatherIcon.src = "/images/icone_rain.png";
  }
  else if (data.weather[0].main == "Snow") {
    weatherIcon.src = "/images/icone_snow.png";
  }
}

checkWeather()

// Date & Heure
function getDate() {
  let today = new Date()
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  if (month < 10) month = "0" + month
  let day = today.getDate();
  let date = `${day}/${month}/${year}`;

  document.querySelector(".date").innerHTML = date;
}

getDate()

function getTime() {
  let locale = "fr-FR";
  let options = { timeZone: "Europe/Paris", hour: "numeric", minute: "numeric", second: "numeric" };
  let datetime = new Date();
  let time = Intl.DateTimeFormat(locale, options).format(datetime);

  document.querySelector(".heure").innerHTML = time;
  setTimeout(getTime, 1000)
}

getTime()

//Minuteur
let myAudio = document.getElementById("audio")
let departMinutes = 5
let buttonChoose = document.getElementById("submit")
buttonChoose.addEventListener("click", function () {
  departMinutes = parseInt(document.getElementById("input").value)
});

let timerElement = document.getElementById("timer")
let timerId;

function timer(temps) {
  let minutes = parseInt(temps / 60, 10)
  let secondes = parseInt(temps % 60, 10)

  minutes = minutes < 10 ? "0" + minutes : minutes
  secondes = secondes < 10 ? "0" + secondes : secondes

  timerElement.innerText = `${minutes}:${secondes}`
  temps = temps <= 0 ? 0 : temps - 1
  if (temps === 0) {
    myAudio.play();
    departMinutes = 5;
    clearTimeout(timerId);
  } else {
    timerId = setTimeout(timer, 1000, temps);
  }
}

let buttonStart = document.getElementById("start");
buttonStart.addEventListener("click", function () {
  let temps = departMinutes * 60
  timer(temps)
});

let buttonRestart = document.getElementById("restart");
buttonRestart.addEventListener("click", function () {
  departMinutes = 5;
  clearTimeout(timerId);
  timerElement.innerText = "05:00";
});

//To Do List
const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const list = document.querySelector('#todo-items');
const progressBar = document.querySelector('#progress-bar');
let completedTasks = 0;
window.addEventListener('beforeunload', updateProgressBar);

// Récupération des éléments de la liste stockés dans le local storage
const storedItems = localStorage.getItem('todo-items');
if (storedItems) {
  const items = JSON.parse(storedItems);
  items.forEach((item) => {
    const li = document.createElement('li');
    li.classList.add('item');
    li.innerHTML = `
      <input type="checkbox" ${item.completed ? 'checked' : ''} />
      <span>${item.text}</span>
      <button>Remove</button>
    `;
    list.appendChild(li);
  });
  updateProgressBar();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value.trim()) {
    const item = {
      text: input.value,
      completed: false,
    };
    const li = document.createElement('li');
    li.classList.add('item');
    li.innerHTML = `
      <input type="checkbox" />
      <span>${input.value}</span>
      <button>Remove</button>
    `;
    list.appendChild(li);
    input.value = '';
    updateProgressBar();
    // Stockage des éléments de la liste dans le local storage
    const items = Array.from(list.children).map((li) => {
      return {
        text: li.querySelector('span').textContent,
        completed: li.querySelector('input').checked,
      };
    });
    localStorage.setItem('todo-items', JSON.stringify(items));
  }
});

list.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    e.target.parentElement.remove();
    updateProgressBar();
    // Mise à jour du local storage
    const items = Array.from(list.children).map((li) => {
      return {
        text: li.querySelector('span').textContent,
        completed: li.querySelector('input').checked,
      };
    });
    localStorage.setItem('todo-items', JSON.stringify(items));
  }

  if (e.target.tagName === 'INPUT') {
    e.target.parentElement.classList.toggle('completed');
    updateProgressBar();
    // Mise à jour du local storage
    const items = Array.from(list.children).map((li) => {
      return {
        text: li.querySelector('span').textContent,
        completed: li.querySelector('input').checked,
      };
    });
    localStorage.setItem('todo-items', JSON.stringify(items));
  }
});

function updateProgressBar() {
  const completedItems = document.querySelectorAll('#todo-items li input:checked');
  const totalItems = document.querySelectorAll('#todo-items li');
  let percentage;
  if (totalItems.length === 0) {
    percentage = 0;
  } else {
    percentage = (completedItems.length / totalItems.length) * 100;
  }
  progressBar.style.width = `${percentage}%`;
  progressBar.textContent = `${percentage.toFixed(0)}%`;
}