import $ from 'jquery';
import axios from 'axios';
import apiKeys from './apiKeys';

const coordConverter = (lat, long, zoom) => {
  const latRad = lat * Math.PI / 180;
  const n = (2 ** zoom);
  const xTile = n * ((long + 180) / 360);
  const yTile = n * (1 - (Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI)) / 2;

  return { xTile, yTile };
};

const getWeather = coordinates => new Promise((resolve, reject) => {
  axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&units=imperial&APPID=${apiKeys.weather}`)
    .then((data) => {
      resolve(data);
    })
    .catch((error) => {
      reject(error);
    });
});

const getWeatherMap = coordinates => new Promise((resolve, reject) => {
  const zoom = 15;
  const { xTile, yTile } = coordConverter(coordinates.latitude, coordinates.longitude, zoom);
  axios.get(`https://sat.owm.io/sql/${xTile}/${yTile}/${zoom}/?appid=${apiKeys.owm}&overzoom=true&op=rgb&from=l8&select=b4,b3,b2&order=last`)
    .then((data) => {
      resolve(data);
    })
    .catch((error) => {
      reject(error);
    });
});

const weatherBuilder = (weatherData) => {
  const temperatureData = weatherData.data.main;
  const weather = weatherData.data.weather[0];
  const wind = weatherData.data.wind;

  const htmlString = `<div class="jumbotron">
    <h1 class="display-4">Local weather for ${weatherData.data.name}</h1>
    <div class='weatherDescContainer'>
      <img src='http://openweathermap.org/img/wn/${weather.icon}@2x.png' alt='weather icon' class='weatherIcon'/>
      <p class="lead weatherDesc">${weather.description}</p>
    </div>
    <div class='tempContainer'>
      <p class="lead weatherUnit">Temperature: ${Math.round(temperatureData.temp)} F</p>
      <p class="lead weatherUnit">High: ${Math.round(temperatureData.temp_max)} F</p>
      <p class="lead weatherUnit">Low: ${Math.round(temperatureData.temp_min)} F</p>
    </div>
    <hr class="my-4">
    <div class='tempContainer'>
      <p class="lead weatherUnit">Humidity: ${temperatureData.humidity}%</p>
      <p class="lead weatherUnit">Pressure: ${temperatureData.pressure} hPa</p>
    </div>
    <p>Wind speed: ${wind.speed} mph</p>
    <p>Wind direction: ${wind.deg} degrees</p>
  </div>`

$('#weather-container').append(htmlString);
};

export default {
  getWeather,
  getWeatherMap,
  weatherBuilder,
};
