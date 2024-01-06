document.addEventListener('DOMContentLoaded', function () {
   const rollNumberInput = document.getElementById('rollNumber');
   const downloadButton = document.getElementById('downloadButton');
   const resultMessage = document.getElementById('resultMessage'); // Assuming there is an element with id 'resultMessage'
   rollNumberInput.focus();
   downloadButton.disabled = true; // Disable the button initially
   resultMessage.innerText = 'Please wait while we are establishing a connection...';

   const baseUrl = 'https://api_last-1-j0851899.deta.app/';
   // const baseUrl = 'https://kanwaradnanpusms-vvicnw7txq-uc.a.run.app/';
   
   // Wake up API
   fetch(baseUrl)
      .then(response => {
         console.log('API is awake');
         downloadButton.disabled = false; // Enable the button once the API is awake
         resultMessage.innerText = ''; // Clear the message once the connection is established
      })
      .catch(error => {
         console.error('Error:', error);
         resultMessage.innerText = 'Error establishing connection. Please try again.';
      });

   rollNumberInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && !downloadButton.disabled) {
         event.preventDefault();
         downloadResults();
      }
   });
});
function validateRollNumber(rollNumber) {
   const rollNumberPattern = /^[0-9]{5,6}$/;
   return rollNumberPattern.test(rollNumber);
}
function downloadResults() {
   const rollNumberInput = document.getElementById('rollNumber');
   const rollNumber = rollNumberInput.value;
   const resultType = document.getElementById('resultType').value; // Get the selected slip type
   const resultMessage = document.getElementById('resultMessage');

   if (!rollNumber) {
      resultMessage.innerHTML = 'Please enter a roll number.';
      return;
   }

   if (!validateRollNumber(rollNumber)) {
      resultMessage.innerHTML = 'Please enter a valid 5 to 6 digit roll number.';
      return;
   }

   const apiUrl = getApiUrl(resultType);
   resultMessage.innerHTML = 'Processing, Download will begin shortly...'; // Display processing message

   // Create a form and submit it
   const form = document.createElement('form');
   form.method = 'post';
   form.action = apiUrl;

   const hiddenField = document.createElement('input');
   hiddenField.type = 'hidden';
   hiddenField.name = 'roll_no';
   hiddenField.value = rollNumber;

   form.appendChild(hiddenField);
   document.body.appendChild(form);

   form.submit();

   // Clean up
   document.body.removeChild(form);
   
   // Update the message after form submission
   //resultMessage.innerHTML = 'Download initiated!';

   // Clear the message after 2 seconds
   setTimeout(() => {
      resultMessage.innerHTML = '';
   }, 1000);
}


function getApiUrl(resultType) {
   // Old API URL
   // const oldBaseUrl = 'https://kanwaradnanpusms-vvicnw7txq-uc.a.run.app/';

   const baseUrl = 'https://api_last-1-j0851899.deta.app/';

   if (resultType === 'sems') {
      return `${baseUrl}generate_all_cards`;
   } else {
      return `${baseUrl}generate_card`;
   }
}
function clearForm() {
   document.getElementById('rollNumber').value = '';
   document.getElementById('resultMessage').innerHTML = '';
   const rollNumberInput = document.getElementById('rollNumber');
   rollNumberInput.focus();
}


