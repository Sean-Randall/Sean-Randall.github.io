document.addEventListener('DOMContentLoaded', () => {
    // Constants
    const MAX_CP = 3600;

    // Element references for CP calculation
    const cpInput = document.getElementById('user-cp');
    const form = document.getElementById('cp-form');
    const resultDisplay = document.getElementById('percentile-result');
    const errorDisplay = document.createElement('p'); // Element for displaying errors
    errorDisplay.id = 'errorDisplay';

    // Check if .stats-section exists and append errorDisplay
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        statsSection.appendChild(errorDisplay);
    } else {
        console.error('Element with class "stats-section" not found.');
    }

    // Function to get CP data from the table
    function getCPDataFromTable() {
        const cpData = [];
        const table = document.getElementById('membersTable');
        if (table) {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const cpCell = row.querySelector('td:nth-child(3)'); // Assuming CP is in the third column
                const cpText = cpCell.textContent.trim();
                const cpValue = parseInt(cpText);
                if (!isNaN(cpValue)) {
                    cpData.push(cpValue);
                }
            });
        }
        return cpData;
    }

    // Event listener for CP form submission
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent form from submitting normally

            const inputCP = parseInt(cpInput.value);
            const cpData = getCPDataFromTable(); // Retrieve CP data from the table
            
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
            
            // Find the maximum CP value in the table or use the predefined maximum
            const maxCP = Math.max(...cpData, MAX_CP);

            // Calculate percentile
            let percentile = (inputCP / maxCP) * 100;

            resultDisplay.innerHTML = `
                Your CP: ${inputCP}<br>
                Percentile: ${percentile.toFixed(2)}%<br>
            `;
        });
    }

    // Function to calculate average CP for the Members page
    function calculateAverageCP() {
        const table = document.getElementById("membersTable");
        if (table) {
            const cpCells = table.querySelectorAll("tbody td:nth-child(3)");
            let sum = 0;
            let count = 0;

            cpCells.forEach(cell => {
                const cpValue = parseInt(cell.textContent);
                if (!isNaN(cpValue)) { // Include only numeric CP values
                    sum += cpValue;
                    count++;
                }
            });

            const averageCP = count > 0 ? (sum / count).toFixed(0) : 0;
            document.getElementById("average-cp").textContent = `Average Guild CP: ${averageCP}`;
        }
    }

    // Calculate average CP on page load
    calculateAverageCP();

    // Event listener to dynamically update additional options based on event type
    const eventTypeOptionsContainer = document.getElementById('event-type-options');
    const additionalOptionsDiv = document.getElementById('additional-options');
    const eventForm = document.getElementById('event-form');
    const formFeedback = document.getElementById('form-feedback');
    
    if (eventTypeOptionsContainer) {
        eventTypeOptionsContainer.addEventListener('change', () => {
            const selectedType = document.querySelector('input[name="event-type"]:checked') ? document.querySelector('input[name="event-type"]:checked').value : null;
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
                        <option value="other">Other</option>
                    </select>
                `;
            } else {
                // Clear additional options if "Other" is selected
                additionalHTML = '';
            }

            additionalOptionsDiv.innerHTML = additionalHTML;
        });
    }

    // Event listener to handle event form submission
    if (eventForm) {
        eventForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission

            // Clear previous feedback
            formFeedback.innerHTML = '';

            // Retrieve form field values
            const eventName = document.getElementById('event-name').value.trim();
            const eventType = document.querySelector('input[name="event-type"]:checked') ? document.querySelector('input[name="event-type"]:checked').value : null;
            const eventDescription = document.getElementById('event-description').value.trim();
            const pveType = document.getElementById('pve-type') ? document.getElementById('pve-type').value : null;
            const pvpType = document.getElementById('pvp-type') ? document.getElementById('pvp-type').value : null;

            // Validate required fields
            if (!eventName || !eventType || !eventDescription) {
                formFeedback.innerHTML = 'Please fill out all required fields.';
                return;
            }

            // Additional validation based on event type
            if (eventType === 'pve' && !pveType) {
                formFeedback.innerHTML = 'Please select a PVE type.';
                return;
            }
            if (eventType === 'pvp' && !pvpType) {
                formFeedback.innerHTML = 'Please select a PVP type.';
                return;
            }

            // Display confirmation message
            formFeedback.innerHTML = 'Event submitted successfully!';
        });
    }
});
