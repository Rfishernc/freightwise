import $ from 'jquery';
import weather from '../weather/weather';
import news from '../news/news';

/**
       * Software Developer test.
       *
       * Doing research and making API calls are an important part of what we do at FreightWise.  This test will
       * demonstrate your abilities to:
       *
       * - Make an API call
       * - Research an API
       * - Do basic DOM manipulation
       * - Parse data
       * - Handle errors
       * - Be creative
       *
       * Feel free to ask any questions you may have.  Use a lot of comments, and explain why you are doing things.
       * Don't spend more than 1-2 hours on it - we aren't expecting a finished product, but it should work and look
       * nice.  Feel free to use any third party libraries, and if you do so, explain why you used them instead of
       * built in browser APIs.
       *
       * Instructions:
       * - Use the axios (https://github.com/axios/axios) request library to make an API call to the OpenWeatherMap
       *   API for Current Weather Data using this API key:  25e989bd41e3e24ce13173d8126e0fd6
       *   We've already imported this library to get you started.
       * - Use either async/await or Promises.
       * - Get the weather for Brentwood, TN, and write it to the DOM using the `setResults` method below.  Be
       *   creative and make it look nice.
       * - Handle errors and use the `setError` method below to display the error.  Also make it look nice.
       * - If you find any mistakes in the test, fix them, and leave a comment about what you fixed and why.
       * - Make sure your code is readable and maintainable.
       * - Use plenty of descriptive comments.
       * - Make sure your code runs in the latest version of Google Chrome and Firefox (ES6 is allowed).
       * - Make your code live (GitHub with GitHub pages works nice).
       * - Send a link to your finished test to hr+software@freightwisellc.com.
       *
       * If you have time, pick one of these:
       * - Sign up for NewsAPI.org and get the Top Headlines and show them along with the weather.
       * - Use the browser location API to get the user's current location, and show that location's weather.
       * - Show a satellite map of the weather in Brentwood.
       * - Request a user's phone number and send them an SMS with the weather.
       */




/* I replaced the testresults property with properties for each component to give more granularity on 
  how I was writing to the DOM.  Ideally, this would have been a React component but I decided not to deviate too much
  from the existing test structure.  I added an additional setCoordinates method to add a coordinates property to the test 
  for the purposes of geolocation.
*/

class Test {
  constructor(coordinates) {
    this.errorResults = document.getElementById('error-container');
    this.weatherResults = document.getElementById('weather-container');
    this.newsResults = document.getElementById('news-container');
    this.weatherMap = document.getElementById('weather-map');
  }

  /* Used promises to manage the axios calls, then passed the results through to the setResults method.  
    I passed the test object through to the api calling methods in order to allow them to make use of
    the error handling and coordinates.
  */

  run() {
    console.log(new Date().toISOString(), '[Test]', 'Running the test');
    const promiseArray = [weather.getWeather(this), news.getNews(this), weather.getWeatherMap(this)];
    Promise.all(promiseArray)
      .then((data) => {
        this.setResults('news', data[1]);
        this.setResults('weather', data[0]);
        this.setResults('map', data[2]);
      })
      .catch((err) => {
        this.setError(err);
      });

  }

  setCoordinates(coords) {
    this.coordinates = coords;
  }

  /* I modeled the error handling in a pretty simple manner.  I set an error property on the test which is ascribed
    an error string by the various methods.  Anytime the test is reinitiated, the error state is reset to false and the DOM 
    element is unrendered.
  */

  setError(errorState) {
    this.error = errorState;
    const htmlString = this.error ? `<div class='errorDiv'>
                          <p class='errorMsg'>${this.error}</p>
                          <img src='https://media.giphy.com/media/a5MbLFYonqYgg/giphy.gif' class='errorGif' alt='noGif'/>
                        ` : '';
    $(this.testResults).html(htmlString);
  }

  /* Added a target argument to the setResults method so I could reuse the method for each of the components.  
  */

  setResults(target, results) {
    switch(target) {
      case 'news' : $(this.newsResults).append(news.newsBuilder(results, this)); break;
      case 'weather' : $(this.weatherResults).append(weather.weatherBuilder(results, this)); break;
      case 'map' : $(this.weatherMap).append(weather.mapBuilder(results)); break;
      
      default : break;
    }
  }
}

export default {
  Test,
};
