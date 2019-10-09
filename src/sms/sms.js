import $ from 'jquery';
import axios from 'axios';

/* This method is taking the phone number from the input and passing it to my texting api.  
   This is the entry point to the main site functionality, so the error state is always reset
   upon running this method. Then the number is run parsed through a formatting method, also
   checking to see if it was input in a valid format and then if there is no error in the number
   format, an axios call is made to my texting api with the number.  A successful response
   will trigger the test to run.
*/

const getPhoneNumber = (phoneNum, test) => new Promise((resolve, reject) => {
  test.setError(false);
  const formattedNum = phoneFormatter(phoneNum, test);
  if (!test.error) {
    axios.post(`https://localhost:44391/api/texting/${formattedNum}`)
    .then(() => {
      $('#phoneModal').modal('toggle');
      test.run();
      resolve();
    })
    .catch((err) => {
      $('#phoneModal').modal('toggle');
      test.run();
      // test.setError(err);
      reject(err);
    })
  }
});

/* This is a simple formatting method to convert a number from a 999-999-9999 format to the 19999999999 format used by the 
    texting api.  I also added some simple form validation to check that the number was input correctly and used the tests
    setError method to handle the error in the case that it was not.
*/

const phoneFormatter = (phoneNum, test) => {
  const numArray = phoneNum.split('-');
  const joinedNum = numArray.join('');
  const formattedNum = '1' + joinedNum;

  if (numArray.length !== 3) {
    test.setError('Bad phone number format, follow 999-999-9999 format.');
    $('#phoneModal').modal('toggle');
  } else if (numArray[0].length !== 3 || numArray[1].length !== 3 || numArray[2].length !== 4) {
    test.setError('Bad phone number format, follow 999-999-9999 format.');
    $('#phoneModal').modal('toggle');
  } else {
    return formattedNum;
  }
}

/* This method just creates a dom string for the phone input modal, appends it to the body of the DOM and assigns an event handler
   to the button within the modal.
*/

const phoneBuilder = (test) => {
  const htmlString = `<div class="modal fade" id="phoneModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                          <div class="modal-content">
                            <div class="modal-header">
                              <h5 class="modal-title" id="exampleModalLabel">Register with Phone Number</h5>
                              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>
                            <div class="modal-body">
                              <div class="input-group mb-3">
                              <input type="text" class="form-control" id='phoneInput' placeholder="999-999-9999" aria-label="phone number" aria-describedby="phoneBtn">
                              <div class="input-group-append">
                                <button class="btn btn-outline-secondary" type="button" id="phoneBtn">Submit</button>
                              </div>
                          </div>
                            </div>
                            <div class="modal-footer">
                              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                          </div>
                        </div>
                      </div>`
$('body').append(htmlString);
$('#phoneBtn').click(() => {
  getPhoneNumber($('#phoneInput')[0].value, test);
});

};

export default {
  getPhoneNumber,
  phoneBuilder,
};
