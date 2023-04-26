const fetchConnections = () => {
    fetch('/listConnections')
      .then(response => response.json())
      .then(data => {
        const connections = data['Connections'];
        for (let i of connections) {
          console.log(i);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  };
  fetchConnections();
  