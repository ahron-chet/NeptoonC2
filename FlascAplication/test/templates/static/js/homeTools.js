const connectionsTableBody = document.getElementById("connectionsTableBody");

function updateConnections() {
  connectionsTableBody.innerHTML = ""; // Clear the table before fetching new connections

  fetch('/listConnections')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Data received:', data);
      for (const ip in data) {
        console.log('Processing connection:', ip);

        const connection = data[ip];

        const tableRow = document.createElement("tr");

        // IP address cell
        const ipCell = document.createElement("td");
        ipCell.textContent = ip;
        tableRow.appendChild(ipCell);

        // Hostname cell
        const hostCell = document.createElement("td");
        hostCell.textContent = connection.hostname;
        tableRow.appendChild(hostCell);

        // Status cell
        const Hoststatus = document.createElement("td");
        Hoststatus.style.display = "flex";
        Hoststatus.style.justifyContent = "center";
        Hoststatus.style.alignItems = "center";

        const statusButton = document.createElement("button");
        statusButton.classList.add("btn", "connectBtn");

        statusButton.style.fontWeight = "bold";

        if (connection.connected) {
          statusButton.textContent = "On";
          statusButton.style.backgroundColor = "green";
        } else {
          statusButton.textContent = "Off";
          statusButton.style.backgroundColor = "rgba(255, 0, 0, 0.415)";
        }

        statusButton.onclick = function () {
          if (statusButton.textContent === "Off") {
            statusButton.textContent = "On";
            statusButton.style.backgroundColor = "green";
        
            // Navigate to the new URL in the same window
            window.location.href = '/getshell/' + ip;
          } else {
            statusButton.textContent = "Off";
            statusButton.style.backgroundColor = "rgba(255, 0, 0, 0.415)";
            // Call a function to disconnect the host
          }
        };
      
        Hoststatus.appendChild(statusButton);
        tableRow.appendChild(Hoststatus);

        connectionsTableBody.appendChild(tableRow);
      }
    })
    .catch(error => console.error('Error fetching data:', error));
}
