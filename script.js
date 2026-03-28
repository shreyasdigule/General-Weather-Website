import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, addDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// 🔑 PASTE YOUR FIREBASE CONFIG HERE
const firebaseConfig = {
  apiKey: "AIzaSyCUTcY8_Ryex-kEPu_6y2b2FUOa0BAdLLE",
  authDomain: "weather-app-1df36.firebaseapp.com",
  projectId: "weather-app-1df36",
  storageBucket: "weather-app-1df36.firebasestorage.app",
  messagingSenderId: "405717370476",
  appId: "1:405717370476:web:e29806c5e362353fa9ba49"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🌦️ WEATHER FUNCTION
window.getWeather = async function () {
  const city = document.getElementById("city").value;

  const apiKey = "8975274e1a05e7c3325472f1e65ef4a2";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  const res = await fetch(url);
  const data = await res.json();

  document.getElementById("temp").innerText = data.main.temp + "°C";
  document.getElementById("condition").innerText = data.weather[0].main;
  document.getElementById("cityName").innerText = city;
  setBackground(data.weather[0].main);

  // ☁️ SAVE TO FIREBASE
  await addDoc(collection(db, "searches"), {
    city: city,
    time: new Date()
  });

  loadHistory();
};

window.clearHistory = async function () {
  const querySnapshot = await getDocs(collection(db, "searches"));

  querySnapshot.forEach(async (d) => {
    await deleteDoc(doc(db, "searches", d.id));
  });

  loadHistory();
};

// 🎨 BACKGROUND LOGIC
function setBackground(weather) {
  if (weather.includes("Cloud")) {
    document.body.style.backgroundImage = "url('images/cloudy.jpg')";
  } else if (weather.includes("Rain")) {
    document.body.style.backgroundImage = "url('images/rain.jpg')";
  } else if (weather.includes("Clear")) {
    document.body.style.backgroundImage = "url('images/clear.jpg')";
  } else {
    document.body.style.backgroundImage = "url('images/default.jpg')";
  }
}

// 📜 LOAD HISTORY
async function loadHistory() {
  const querySnapshot = await getDocs(collection(db, "searches"));
  const list = document.getElementById("history");

  list.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const li = document.createElement("li");
    li.innerText = doc.data().city;
    list.appendChild(li);
  });
}

loadHistory();

const condition = data.weather[0].main;

let emoji = "🌤️";

if (condition.includes("Cloud")) emoji = "☁️";
else if (condition.includes("Rain")) emoji = "🌧️";
else if (condition.includes("Clear")) emoji = "☀️";

document.getElementById("condition").innerText = `${emoji} ${condition}`;