// api.openweathermap.org/data/2.5/weather?q={city name}&appId={your api key}
const weatherApi = {
    key: "188b68e6b443a5380ce7ee0f0bb49cfc",
    baseUrl: "https://api.openweathermap.org/data/2.5/weather",
};
const __LOCAL_STORAGE_NAME = "weather_DB";

const searchInputBox = document.getElementById("input-box");
const searchBtn = document.querySelector(".button");
const errorMsg = document.querySelector(".error-msg");

// Event listener Function on keypress
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (searchInputBox.value !== "") {
//     console.log(searchInputBox.value);
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
//       console.log("SW registered");
    } catch (error) {
//       console.log("SW reg failed");
    }
  }
});

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


const createLocalStorageDB = (localStorageName, defaultData) => {

    // Check to see if there existed a previous local storage with specified 
    // name before creating it. If there was an existing local storage with 
    // specified name we just ignore creation ... since the pre-existing local
    // storage might already contain data. If no local storage existed with name
    // we just create it.

    const existingStorage = window.localStorage.getItem(localStorageName); 
    if (!existingStorage) {
        const defaultDataAsJson = JSON.stringify(defaultData);
        window.localStorage.setItem(localStorageName, defaultDataAsJson);
    }
};

const addWeatherDataToLocalStorage = (newWeatherData) => {

    // Read current local storage data
    const weatherDBRawData = window.localStorage.getItem(__LOCAL_STORAGE_NAME); 

    // If there wasn't any local storage with specified name
    // we throw an error as this should not be the case.
    if (!weatherDBRawData) {
        throw new Error(`Local storage for ${__LOCAL_STORAGE_NAME} not set`);
    }

    // Update the extracted storage
    let weatherDBObj = JSON.parse(weatherDBRawData); 
    weatherDBObj.citySearches = [newWeatherData, ...weatherDBObj.citySearches]

    // Save the newly update data
    window.localStorage.setItem(__LOCAL_STORAGE_NAME, JSON.stringify(weatherDBObj));
};

// Get Weather Report
function getWeatherReport(city) {
  fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)
    .then((weather) => {
      return weather.json();

    }).then((weatherData) => {
        const weatherDB = window.localStorage.getItem(__LOCAL_STORAGE_NAME); 
        if (!weatherDB) {
            const sampleDBStructure = {
                citySearches: []
            }
            createLocalStorageDB(__LOCAL_STORAGE_NAME, sampleDBStructure);
        }
        addWeatherDataToLocalStorage(weatherData);
        return weatherData
    })
    .then(showWeatherReport);
}
// Show weather Report
function showWeatherReport(weather) {
//     console.log(weather);

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
