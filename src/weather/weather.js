import $ from 'jquery';
import axios from 'axios';
import apiKeys from './apiKeys';

/* This method takes the coordinate values from the geolocation and converts them to the mercator format
  used by the sattelite imagery.  To be honest I copied the math code from an example I found online and 
  probably couldn't explain that part.  I rounded the results to a whole number as the vane api
  would only recognize to a few decimals.
*/

const coordConverter = (lat, long, zoom) => {
  const latRad = lat * Math.PI / 180;
  const n = (2 ** zoom);
  const xTile = Math.round(n * ((long + 180) / 360));
  const yTile = Math.round(n * (1 - (Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI)) / 2);

  return { xTile, yTile };
};

/* Used a basic axios get call with a promise to grab the weather data from openweather.  I'm passing in the geolocated coordinates.
*/

const getWeather = test => new Promise((resolve, reject) => {
  axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${test.coordinates.latitude}&lon=${test.coordinates.longitude}&units=imperial&APPID=${apiKeys.weather}`)
    .then((data) => {
      resolve(data);
    })
    .catch((error) => {
      test.setError(error);
      reject(error);
    });
});

/* Used a basic axios get call with a promise to grab the map image from vane.  I'm passing in the geolocated coordinates 
  and converting to mercator format.  Since the api returns the actual png file, I'm just using the call to confirm access
  to the resource and then passing the endpoint url along to the DOM builder.
*/

const getWeatherMap = test => new Promise((resolve, reject) => {
  const zoom = 7;
  const { xTile, yTile } = coordConverter(test.coordinates.latitude, test.coordinates.longitude, zoom);
  const imageUrl = `http://sat.owm.io/sql/${zoom}/${xTile}/${yTile}?from=s2&APPID=${apiKeys.owm}`;
  axios.get(imageUrl)
    .then(() => {
      const layerUrl = `https://tile.openweathermap.org/map/clouds_new/${zoom}/${xTile}/${yTile}.png?appid=${apiKeys.weather}`;
      console.log(layerUrl);
      axios.get(layerUrl)
        .then((data) => {
          console.log(data);
          resolve(imageUrl);
        });
    })
    .catch((error) => {
      test.setError(error);
      reject(error);
    });
});

/* I'm passing in the response from the weather api and then using basic string interpolation to 
  build out a DOM string.  I'm then returning this string to be accessed by the setResults method in the test.
*/

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

  return htmlString;
};

/* I'm passing in the endpoint url from the map api and then using basic string interpolation to 
  build out a DOM string.  I'm then returning this string to be accessed by the setResults method in the test.
*/

const mapBuilder = (mapResponse) => {
  const htmlString = `<div class='mapDiv'>
                        <p class='mapTitle'>Sattelite Weather for your area</p>
                        <img src=${mapResponse} alt='weather map'/>
                      </div>`
  return htmlString;
};

export default {
  getWeather,
  getWeatherMap,
  weatherBuilder,
  mapBuilder,
};
