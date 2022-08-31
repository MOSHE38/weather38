// api.openweathermap.org/data/2.5/weather?q={city name}&appId={your api key}
const weatherApi = {
  key: "188b68e6b443a5380ce7ee0f0bb49cfc",
  baseUrl: "https://api.openweathermap.org/data/2.5/weather",
};

const searchInputBox = document.getElementById("input-box");
const searchBtn = document.querySelector(".button");
const errorMsg = document.querySelector(".error-msg");

// Event listener Function on keypress
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (searchInputBox.value !== "") {
    // console.log(searchInputBox.value);
    getWeatherReport(searchInputBox.value);
    document.querySelector(".weather-body").style.display = "block";
    errorMsg.style.display = "none";

    // Function to trigger local storage 'DB' creation.
    createLocalStorageDB();

    // Function to read data from localStorage 'DB'.
    readLocalStorageDB();
  } else {
    errorMsg.style.display = "block";
  }

  if ("serviceWorker" in navigator) {
    try {
      navigator.serviceWorker.register("sw.js");
      console.log("SW registered");
    } catch (error) {
      console.log("SW reg failed");
    }
  }
});

const createLocalStorageDB = () => {
  const weather_DB = window.localStorage.getItem(
    "searchInputBox",
    searchInputBox
  );

  const weather_DB_obj = JSON.parse(weather_DB);

  if (!weather_DB_obj) {
    const newWeatherDB = {
      data: [], // array that will store all your weather data .
    };

    window.localStorage.setItem(searchInputBox, JSON.stringify(newWeatherDB));
  } else {
  }
};

const readLocalStorageDB = () => {
  const weather_DB = window.localStorage.getItem(
    "searchInputBox",
    searchInputBox
  );
  const weather_DB_obj = JSON.parse(weather_DB);

  if (!weather_DB_obj) {
    return []; // return empty array (to signify no data)
  }

  // return weather data;
  return weather_DB_obj.data;
};

const addWeatherDataToLocalStorage = (newWeatherData) => {
  if (!newWeatherData) {
    throw new Error(
      "Cannot add 'undefined' or 'null' data to local storage weather's DB"
    );
  }

  const weather_DB = window.localStorage.getItem(
    "searchInputBox",
    searchInputBox
  );
  const weather_DB_obj = JSON.parse(weather_DB);

  if (!weather_DB_obj) {
    throw new Error("weather local storage not defined");
  } else {
    // Update previous localStorage data
    weather_DB_obj.data = [newWeatherData, ...weather_DB.data];

    // Replace old data with new updated data in storage.
    window.localStorage.setItem(searchInputBox, JSON.stringify(weather_DB_obj));
  }
};

// Get Weather Report
function getWeatherReport(city) {
  fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)
    .then((weather) => {
      return weather.json();
    })
    .then(showWeatherReport);
}
// Show weather Report
function showWeatherReport(weather) {
  console.log(weather);

  let city = document.getElementById("city");
  city.innerHTML = `${weather.name}, ${weather.sys.country}`;

  let temperature = document.getElementById("temp");
  temperature.innerHTML = `${Math.round(weather.main.temp)}&deg;C`;

  let minMaxTemp = document.getElementById("min-max");
  minMaxTemp.innerHTML = `${Math.floor(
    weather.main.temp_min
  )}&deg;C (min) / ${Math.floor(weather.main.temp_max)}&deg;C`;

  let weatherType = document.getElementById("weather");
  weatherType.innerHTML = `${weather.weather[0].main}`;

  let date = document.getElementById("date");
  let todayDate = new Date();
  date.innerHTML = dateManager(todayDate);

  if (weatherType.textContent == "Clear") {
    document.body.style.backgroundImage = "url('images/clear.jpg')";
  } else if (weatherType.textContent == "Clouds") {
    document.body.style.backgroundImage = "url('images/cloudy.jpg')";
  } else if (weatherType.textContent == "Haze") {
    document.body.style.backgroundImage = "url('images/haze.jpg')";
  } else if (weatherType.textContent == "Rain") {
    document.body.style.backgroundImage = "url('images/rain.jpg')";
  } else if (weatherType.textContent == "Snow") {
    document.body.style.backgroundImage = "url('images/snow.jpg')";
  } else if (weatherType.textContent == "Thunderstorm") {
    document.body.style.backgroundImage = "url('images/thunderstorm.jpg')";
  }
}

// Date manager
function dateManager(dateArg) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let year = dateArg.getFullYear();
  let month = months[dateArg.getMonth()];
  let date = dateArg.getDate();
  let day = days[dateArg.getDay()];

  return `${date} ${month} ${day}, ${year}`;
}
