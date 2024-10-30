

function performSearch() {
    const query = document.getElementById('search-input').value.trim().toLowerCase();
    if (query === 'qdocs') {
        document.getElementById('search-section').classList.add('hidden');
        document.getElementById('login-section').classList.remove('hidden');
        document.getElementById('error-message').innerText = '';
    } else {
        document.getElementById('error-message').innerText = 'Error: Please enter "Qdocs" to proceed.';
    }
}

async function performLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    try {
        const loginResponse = await fetch('https://cors-anywhere.herokuapp.com/https://partnersi-prana4life-Quality.veevavault.com/api/v24.1/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });

        if (!loginResponse.ok) throw new Error('Login failed');
        const loginData = await loginResponse.json();
        const sessionId = loginData.sessionId;

        const metadataResponse = await fetch('https://cors-anywhere.herokuapp.com/https://partnersi-prana4life-clinical.veevavault.com/api/v24.1/metadata/vobjects', {
            method: 'GET',
            headers: {
                'Authorization': sessionId,
                'Accept': 'application/json'
            }
        });

        if (!metadataResponse.ok) throw new Error('Metadata fetch failed');
        const metadata = await metadataResponse.json();

        displayMetadataInTable(metadata.objects);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('login-error-message').innerText = error.message;
    }
}

function displayMetadataInTable(objects) {
    const table = document.getElementById('metadata-table');
    const rows = objects
        .filter(obj => obj.name.endsWith('__sys'))
        .map(obj => `
            <tr>
                <td>${obj.label}</td>
                <td>${obj.name}</td>
                <td>${obj.status.join(', ')}</td>
                <td>${obj.description}</td>
            </tr>
        `)
        .join('');
    table.innerHTML += rows;

    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('table-section').classList.remove('hidden');
}
