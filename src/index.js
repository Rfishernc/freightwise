import './index.scss';
import 'bootstrap';
import Test from './tests/test';
import Geolocate from './geolocate/geolocate';
import weather from './weather/weather';

/**
       * Creates a button for kicking off the test and adds it to the DOM.
       *
       * @param {HTMLElement} context  the parent element to add the button to
       * @param {Test}        test     the test to be executed
       * @returns {HTMLElement} the button added to the test
       */

function addButtonForTest(context, test, location) {
  const testButton = document.createElement('button');

  testButton.type = 'button';
  testButton.innerText = `Get the ${location} Weather`;
  testButton.onclick = () => test.run();

  context.appendChild(testButton);

  return testButton;
}

// Create the Test and add a button to the UI for running the test
const test = new Test.Test();
const buttonContainer = document.getElementsByClassName('button-container')[0];

Geolocate.geolocate()
  .then((coordinates) => {
    test.setCoordinates(coordinates.coords);
    weather.getWeather(coordinates.coords)
      .then((data) => {
        addButtonForTest(buttonContainer, test, data.data.name);
      })
      .catch((err) => {
        console.log(err);
      })
  })
  .catch((err) => {
    console.log(err);
  });
