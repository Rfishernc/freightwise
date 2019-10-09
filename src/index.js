import './index.scss';
import 'bootstrap';
import Test from './tests/test';
import Geolocate from './geolocate/geolocate';
import weather from './weather/weather';
import sms from './sms/sms';

/* I decided to use webpack to bundle/build the project so I could easily integrate node modules and handle imports.
    I split the existing test class into its own file so that the index script is used for page initiation only.
*/

/**
       * Creates a button for kicking off the test and adds it to the DOM.
       *
       * @param {HTMLElement} context  the parent element to add the button to
       * @param {Test}        test     the test to be executed
       * @returns {HTMLElement} the button added to the test
       */

// Create the Test and add a button to the UI for running the test
const test = new Test.Test();
const buttonContainer = document.getElementsByClassName('button-container')[0];

const addButtonForTest = (context, test, location) => {
  const htmlString = `<button type='button class='btn btn-info' data-toggle="modal" data-target="#phoneModal" id='testBtn'>
                        Get the ${location} Weather
                      </button>`;

  context.innerHTML = htmlString;
};

Geolocate.geolocate()
  .then((coordinates) => {
    test.setCoordinates(coordinates.coords);
    weather.getWeather(test)
      .then((data) => {
        addButtonForTest(buttonContainer, test, data.data.name);
        sms.phoneBuilder(test);
      })
      .catch((err) => {
        test.setError(err);
      })
  })
  .catch((err) => {
    test.setError(err);
  });
