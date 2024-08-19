// CP related JS
document.addEventListener('DOMContentLoaded', () => {
    const MAX_CP = 3600;
    const cpInput = document.getElementById('user-cp');
    const form = document.getElementById('cp-form');
    const resultDisplay = document.getElementById('percentile-result');
    const errorDisplay = document.createElement('p'); // Create a paragraph for errors
    errorDisplay.id = 'errorDisplay';
    document.querySelector('.stats-section').appendChild(errorDisplay);

    function getCPDataFromTable() {
        const cpData = [];
        const table = document.getElementById('membersTable');
        const rows = table.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const cpCell = row.querySelector('td:nth-child(3)'); // CP is in the third column
            const cpText = cpCell.textContent.trim();
            const cpValue = parseInt(cpText);
            if (!isNaN(cpValue)) {
                cpData.push(cpValue);
            }
        });

        return cpData;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent form submission

        const inputCP = parseInt(cpInput.value);
        const cpData = getCPDataFromTable(); // Get CP data from the table
        
        // Clear previous results and errors
        resultDisplay.innerHTML = '';
        errorDisplay.innerHTML = '';
        
        if (isNaN(inputCP)) {
            errorDisplay.innerHTML = 'Please enter a valid number.';
            return;
        }
        
        if (inputCP > MAX_CP) {
            errorDisplay.innerHTML = 'Error: CP value cannot exceed 3600.';
            return;
        }
        
        if (inputCP < 0) {
            errorDisplay.innerHTML = 'Error: CP value cannot be negative.';
            return;
        }
        
        // Find the maximum CP value in the table
        const maxCP = Math.max(...cpData, MAX_CP);

        // Calculate percentile
        let percentile = (inputCP / maxCP) * 100;

        resultDisplay.innerHTML = `
            Your CP: ${inputCP}<br>
            Percentile: ${percentile.toFixed(2)}%<br>
        `;
    });
});

// Calculating Average CP for Members Page:
document.addEventListener("DOMContentLoaded", function () {
    const table = document.getElementById("membersTable");
    const cpCells = table.querySelectorAll("tbody td:nth-child(3)");
    let sum = 0;
    let count = 0;

    cpCells.forEach(cell => {
        const cpValue = parseInt(cell.textContent);
        if (!isNaN(cpValue)) {  // Only include numeric CP values
            sum += cpValue;
            count++;
        }
    });

    const averageCP = count > 0 ? (sum / count).toFixed(0) : 0;
    document.getElementById("average-cp").textContent = `Average Guild CP: ${averageCP}`;
});

// Event Submission Form
document.addEventListener('DOMContentLoaded', () => {
    // Handle the event type radio button changes
    const eventTypeOptions = document.getElementById('event-type-options');
    const additionalOptionsDiv = document.getElementById('additional-options');
    const eventForm = document.getElementById('event-form');
    const formFeedback = document.getElementById('form-feedback');

    eventTypeOptions.addEventListener('change', () => {
        const selectedType = document.querySelector('input[name="event-type"]:checked').value;
        let additionalHTML = '';

        if (selectedType === 'pve') {
            additionalHTML = `
                <label for="pve-type">PVE Type:</label>
                <select id="pve-type" name="pve-type" required>
                    <option value="">Select PVE Type</option>
                    <option value="dungeons">Dungeons</option>
                    <option value="trials">Trials</option>
                    <option value="delves">Delves</option>
                    <option value="leveling">Leveling</option>
                    <option value="map-completion">Map Completion</option>
                    <option value="other">Other</option>
                </select>
            `;
        } else if (selectedType === 'pvp') {
            additionalHTML = `
                <label for="pvp-type">PVP Type:</label>
                <select id="pvp-type" name="pvp-type" required>
                    <option value="">Select PVP Type</option>
                    <option value="battlegrounds">Battlegrounds</option>
                    <option value="cyrodiil">Cyrodiil</option>
                    <option value="imperial-city">Imperial City</option>
                    <option value="dueling">Dueling</option>
                </select>
            `;
        } else {
            // Clear additional options if "Other" is selected
            additionalHTML = '';
        }

        additionalOptionsDiv.innerHTML = additionalHTML;
    });

    // Handle form submission
    eventForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent form submission

        // Clear previous feedback
        formFeedback.innerHTML = '';

        // Get form field values
        const eventName = document.getElementById('event-name').value.trim();
        const eventType = document.querySelector('input[name="event-type"]:checked') ? document.querySelector('input[name="event-type"]:checked').value : null;
        const eventDescription = document.getElementById('event-description').value.trim();
        const pveType = document.getElementById('pve-type') ? document.getElementById('pve-type').value : null;
        const pvpType = document.getElementById('pvp-type') ? document.getElementById('pvp-type').value : null;

        // Validate form fields
        if (!eventName || !eventType || !eventDescription) {
            formFeedback.innerHTML = 'All fields are required.';
            return;
        }

        if (eventType === 'pve' && !pveType) {
            formFeedback.innerHTML = 'Please select a PVE type.';
            return;
        }

        if (eventType === 'pvp' && !pvpType) {
            formFeedback.innerHTML = 'Please select a PVP type.';
            return;
        }

        // If validation passes
        formFeedback.innerHTML = 'Event submitted successfully!';
    });
});

