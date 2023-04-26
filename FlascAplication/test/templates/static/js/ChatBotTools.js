const titleElement = document.getElementById("dynamic-title");

fetch('/getConnectedHostname')
  .then(response => response.text())
  .then(text => {
    titleElement.textContent = text;
  })
  .catch(error => {
    console.error('Error fetching the title:', error);
  });
