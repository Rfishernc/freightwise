import $ from 'jquery';
import axios from 'axios';

const getPhoneNumber = (phoneNum, test) => new Promise((resolve, reject) => {
  test.setError(false);
  const formattedNum = phoneFormatter(phoneNum, test);
  if (!test.error) {
    axios.post(`https://localhost:44391/api/texting/${formattedNum}`)
    .then(() => {
      $('#phoneModal').modal('toggle');
      test.run();
    })
    .catch((err) => {
      $('#phoneModal').modal('toggle');
      test.run();
      // test.setError(err);
      reject(err);
    })
  }
});

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
