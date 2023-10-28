document.addEventListener('DOMContentLoaded', function () {
    const rollNumberInput = document.getElementById('rollNumber');
    rollNumberInput.focus();

    rollNumberInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            // Prevent the default form submission behavior
            event.preventDefault();
            downloadResults();
        }
    });
});

function downloadResults() {
    const rollNumber = document.getElementById('rollNumber').value;
    const semester = document.getElementById('semester').value;

    if (!rollNumber) {
        alert('Please enter a roll number.');
        return;
    }

    let apiUrl = `https://api_last-1-j0851899.deta.app/generate_card?semester=${semester}&roll_number=${rollNumber}`;

    const data = {
        semester: parseInt(semester),
        roll_number: parseInt(rollNumber),
    };

    fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => {
            console.log('Response status:', response.status);
            if (response.status === 500) {
                alert('Request failed with a 500 status code. Please check your input.');
            } else {
                return response.blob();
            }
        })
        .then((blob) => {
            if (blob) {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Result ${rollNumber} - Semester ${semester}.jpg`;
                link.click();
                window.URL.revokeObjectURL(url);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function clearForm() {
    document.getElementById('rollNumber').value = '';
    document.getElementById('semester').value = '1';
    document.getElementById('resultMessage').innerHTML = '';
}
