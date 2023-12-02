document.addEventListener('DOMContentLoaded', function () {
   const rollNumberInput = document.getElementById('rollNumber');
   rollNumberInput.focus();

   rollNumberInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
         event.preventDefault();
         downloadSlips();
      }
   });
});

function validateRollNumber(rollNumber) {
   const rollNumberPattern = /^[0-9]{5,6}$/;
   return rollNumberPattern.test(rollNumber);
}

const downloadResults = async () => {
   const rollNumberInput = document.getElementById('rollNumber');
   const rollNumber = rollNumberInput.value;
   const resultType = document.getElementById('resultType').value;
   const resultMessage = document.getElementById('resultMessage');

   if (!rollNumber) {
      resultMessage.innerHTML = 'Please enter a roll number.';
      return;
   }

   if (!validateRollNumber(rollNumber)) {
      resultMessage.innerHTML = 'Please enter a valid 5 to 6 digit roll number.';
      return;
   }

   const apiUrl = getApiUrl(resultType, rollNumber);
   resultMessage.innerHTML = 'Processing, Download will begin shortly...';

   try {
      const response = await fetch(apiUrl, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(resultType === 'sems' ? { roll_no: rollNumber } : { semester: resultType, roll_no: rollNumber })
      });

      if (!response.ok) {
         throw new Error(`Please Check your registration status`);
      }

      const contentType = response.headers.get('content-type');
      let ext;

      if (contentType.includes('application/pdf')) {
         ext = 'pdf';
      } else if (contentType.includes('image/jpeg')) {
         ext = 'jpeg';
      } else {
         throw new Error(`Invalid content type: ${contentType}`);
      }

      const blob = await response.blob();

      // Create a download link for the blob data
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement('a');

      // Set the download attribute with the correct filename and extension
      a.href = url;
      a.download = `${rollNumber}.${ext}`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      // Display download successful message
      resultMessage.innerHTML = 'Download successful!';
      clearForm();
   } catch (error) {
      // Handle errors
      console.error('Error:', error.message);
      resultMessage.innerHTML = `Error during download: ${error.message}.`;
   }
};


function getApiUrl(resultType, rollNumber) {
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


