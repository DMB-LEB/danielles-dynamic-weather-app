// API info
var openWeatherUrl = "https://api.openweathermap.org/data/2.5/";
var geoLocationUrl = "http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}";
var apiKey = "8188237b5f6c524c3e3181b9ef57ed1c";

// Global variables
var cityInput = document.getElementById("cityInput");
var searchButton = document.getElementById("searchButton");
var historyValue = document.getElementById("history");
var todaysWeather = document.getElementById("todaysWeather");
var cityHeader = document.getElementById("cityHeader");
var weatherIMG = document.getElementById("weatherIMG");
var temp = document.getElementById("temp");
var humidity = document.getElementById("humidity");
var wind = document.getElementById("wind");
var thisweekHeader = document.getElementById("thisweekHeader");

let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

function weatherPrompt(cityName) {

  var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;
      fetch(weatherUrl)

  .then(function (response) {
      if (response.status !== 200) {
          throw Error("City not found!");
      }
      return response.json();
  })
 
  .then(function (data){
    var currentDate = dayjs();
    let weatherPic = data.weather[0].icon;
    weatherIMG.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
    weatherIMG.setAttribute("alt", data.weather[0].description);
    cityHeader.innerHTML = data.name;
    temp.innerHTML = kToF(data.main.temp) + " &#176F";
    wind.innerHTML = data.wind.speed + " MPH";
    humidity.innerHTML = data.main.humidity + "%";

    let cityID = data.id;
    let forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + apiKey;
        
    return fetch(forecastUrl)
})
    
.then(function (response) {
  return response.json();
})

.then(function (data) {
  const forecastEls = document.querySelectorAll(".forecast");
  for (i = 0; i < forecastEls.length; i++) {
  forecastEls[i].innerHTML = "";
  const forecastIndex = i * 8 + 4;
  const forecastDate = new Date(data.list[forecastIndex].dt * 1000);
  const forecastDay = forecastDate.getDate();
  const forecastMonth = forecastDate.getMonth() + 1;
  const forecastYear = forecastDate.getFullYear();
  const findDate = document.createElement("p");
        
        findDate.setAttribute("class", "mt-3 mb-0 forecast-date");
        findDate.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
        forecastEls[i].append((findDate));

        const forecastweatherEl = document.createElement("img");
        forecastweatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + data.list[forecastIndex].weather[0].icon + "@2x.png");
        forecastweatherEl.setAttribute("alt", data.list[forecastIndex].weather[0].description);
        forecastEls[i].append(forecastweatherEl);

        const forecasttempEl = document.createElement("p");
        forecasttempEl.innerHTML = "Temp: " + kToF(data.list[forecastIndex].main.temp) + " &#176F";
        forecastEls[i].append(forecasttempEl);
    
        const forecastwindEl = document.createElement("p");
        forecastwindEl.innerHTML = "Wind: " + data.list[forecastIndex].wind.speed + " MPH";
        forecastEls[i].append(forecastwindEl);
    
        const forecasthumidityEl = document.createElement("p");
        forecasthumidityEl.innerHTML = "Humidity: " + data.list[forecastIndex].main.humidity + "%";
        forecastEls[i].append(forecasthumidityEl);
        }
    })

    .catch(function (error) {
      alert(error);
      });
  }
  
  function kToF(K) {
      return Math.floor((K - 273.15) * 1.8 + 32);
  }
  
  searchButton.addEventListener("click", function () {
      var searchValue = cityInput.value;
      weatherPrompt(searchValue);
      searchHistory.push(searchValue);
      localStorage.setItem("search", JSON.stringify(searchHistory));
      createHistory();
  })
  
  function createHistory() {
    historyValue.innerHTML = "";
    for (let i = 0; i < searchHistory.length; i++) {
        const historyEl = document.createElement("input");
        historyEl.setAttribute("type", "text");
        historyEl.setAttribute("readonly", true);
        historyEl.setAttribute("class", "form-control d-block bg-white");
        historyEl.setAttribute("value", searchHistory[i]);
        historyEl.addEventListener("click", function () {
            weatherPrompt(historyEl.value);
        })
        historyValue.append(historyEl);
    }
}
