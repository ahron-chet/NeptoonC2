let chatVisible = false;
let selectedClient = null;





function displayClients() {
  const clients = [
    { ip: '192.168.1.1' },
    { ip: '192.168.1.2' },
    { ip: '192.168.1.4' },
    { ip: '192.168.1.5' },
    { ip: '192.168.1.6' },
    { ip: '192.168.1.7' },
    { ip: '192.168.1.8' },
    { ip: '192.168.1.9' },
    { ip: '192.168.1.10' },
    { ip: '192.168.1.11' },
    { ip: '192.168.1.12' },
    { ip: '192.168.1.13' },
    { ip: '192.168.1.14' },
    { ip: '192.168.1.15' },
    { ip: '192.168.1.16' },
    { ip: '192.168.1.17' },
    { ip: '192.168.1.18' },
    { ip: '192.168.1.19' },
    { ip: '192.168.1.20' },
    { ip: '192.168.1.21' },
    { ip: '192.168.1.22' },
    { ip: '192.168.1.23' },
    { ip: '192.168.1.24' },
    { ip: '192.168.1.25' },
    { ip: '192.168.1.26' },
    { ip: '192.168.1.27' },
    { ip: '192.168.1.28' },
    { ip: '192.168.1.29' },
    { ip: '192.168.1.30' },
    { ip: '192.168.1.31' },
    { ip: '192.168.1.32' },
    { ip: '192.168.1.34' },
    { ip: '192.168.1.35' },
    { ip: '192.168.1.36' },
    { ip: '192.168.1.37' },
    { ip: '192.168.1.38' },
    { ip: '192.168.1.39' },
    { ip: '192.168.1.40' },
    { ip: '192.168.1.41' },
    { ip: '192.168.1.42' },
    { ip: '192.168.1.43' },
    { ip: '192.168.1.44' },
    { ip: '192.168.1.45' },
    { ip: '192.168.1.46' },
    { ip: '192.168.1.47' },
    { ip: '192.168.1.48' },
    { ip: '192.168.1.49' },
    { ip: '192.168.1.50' },
    { ip: '192.168.1.51' },
    { ip: '192.168.1.52' },
    { ip: '192.168.1.53' },
    { ip: '192.168.1.54' },
    { ip: '192.168.1.55' },
    { ip: '192.168.1.56' },
    { ip: '192.168.1.57' },
    { ip: '192.168.1.58' },
    { ip: '192.168.1.59' },
    { ip: '192.168.1.60' },
    { ip: '192.168.1.61' },
    { ip: '192.168.1.62' },
    { ip: '192.168.1.63' },
    { ip: '192.168.1.64' },
    { ip: '192.168.1.65' },
    { ip: '192.168.1.66' },
    { ip: '192.168.1.67' },
    { ip: '192.168.1.68' },
    { ip: '192.168.1.69' },
    { ip: '192.168.1.70' },
    { ip: '192.168.1.71' },
    { ip: '192.168.1.72' }
  ];

  const clientsContainer = document.getElementById('clients-container');

  clients.forEach(client => {
    const clientDiv = document.createElement('div');
    clientDiv.className = 'client';

    const clientIcon = document.createElement('i');
    clientIcon.className = 'fa-brands fa-windows';
    clientIcon.style.color = '#49da3e';
    clientIcon.addEventListener('click', () => onClientClick(client, clientIcon));
    clientDiv.appendChild(clientIcon);

    const clientIp = document.createElement('div');
    clientIp.className = 'client-ip';
    clientIp.textContent = client.ip;
    clientDiv.appendChild(clientIp);

    clientsContainer.appendChild(clientDiv);
  });
  function onClientClick(client, clientIcon) {
    const icons = clientsContainer.querySelectorAll('.client img');
    icons.forEach(icon => {
      icon.classList.remove('selected');
    });
  
    if (selectedClient !== client) {
      clientIcon.classList.add('selected');
      handleChat(client.ip);
      chatVisible = true;
    } else {
      toggleChatVisibility();
    }
  
    selectedClient = chatVisible ? client : null;
  }
}

function toggleChatVisibility() {
  const containerChat = document.getElementById('ChatContainer');
  chatVisible = !chatVisible;
  containerChat.style.display = chatVisible ? 'block' : 'none';
}

function handleChat(hostname) {
  const containerChat = document.getElementById('ChatContainer');
  containerChat.style.display = 'block'
  const chatBody = document.querySelector('.chat-body'); // Add this line
  const txtInput = document.getElementById('txtInput');
  const chatHeader = document.querySelector('.chat-header');
  chatHeader.innerHTML = "";
  const ipElement = document.createElement('div');
  ipElement.className = 'title';
  ipElement.textContent = `Client IP: ${hostname}`;
  chatHeader.appendChild(ipElement);


  txtInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      renderUserMessage();
    } else if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      const cursorPosition = txtInput.selectionStart;
      txtInput.value = txtInput.value.slice(0, cursorPosition) + "\n" + txtInput.value.slice(cursorPosition);
      txtInput.selectionEnd = cursorPosition + 1;

      resizeInput();

    }
  });

  txtInput.addEventListener("input", () => {
    resizeInput();
  });

  function resizeInput() {
    const previousHeight = txtInput.style.height ? parseInt(txtInput.style.height.slice(0, -2)) : 0;
  
    const rowsLen = Math.max(txtInput.value.split('\n').length, 1);
    if (rowsLen > 2) {
      txtInput.rows = rowsLen;
    }
    const newHeight = parseInt(txtInput.style.height.slice(0, -2));
    const bottomAdjustment = newHeight - previousHeight;
    txtInput.style.bottom = (parseInt(txtInput.style.bottom.slice(0, -2)) - bottomAdjustment) + "px";
    txtInput.scrollTop = txtInput.scrollHeight;
  }
  
  

  const renderUserMessage = () => {
    const userInput = txtInput.value;
    renderMessageEle(userInput, "user");
    txtInput.value = "";
    setTimeout(() => {
      renderChatbotResponse(userInput);
    }, 600);
  };

  const renderChatbotResponse = async (userInput) => {
    try {
      const response = await fetch("/send_message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userInput, ip: hostname })
      });

      const data = await response.json();
      const chatbotResponse = data.message;
      renderMessageEle(chatbotResponse);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const renderMessageEle = (txt, type) => {
    let className = "user-message";
    if (type !== "user") {
      className = "chatbot-message";
    }
    const messageEle = document.createElement("div");
    const txtNode = document.createTextNode(txt);
    messageEle.classList.add(className);
    messageEle.append(txtNode);
    chatBody.append(messageEle);
    setTimeout(() => {
      setScrollPosition();
    }, 10);
  };

  const setScrollPosition = () => {
    if (chatBody.scrollHeight > 0) {
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  };
}

displayClients()