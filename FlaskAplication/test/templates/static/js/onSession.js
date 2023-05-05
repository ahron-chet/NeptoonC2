function displayClients() {
  const clients = [
    { ip: '192.168.1.1' },
    { ip: '192.168.1.2' },
    { ip: '192.168.1.3' }
  ];

  const clientsContainer = document.getElementById('clients-container');

  clients.forEach(client => {
    const clientDiv = document.createElement('div');
    clientDiv.className = 'client';

    const clientIcon = document.createElement('img');
    clientIcon.src = '../images/logo.png';
    clientIcon.addEventListener('click', () => onClientClick(client, clientIcon));
    clientDiv.appendChild(clientIcon);

    const clientIp = document.createElement('div');
    clientIp.className = 'client-ip';
    clientIp.textContent = client.ip;
    clientDiv.appendChild(clientIp);

    clientsContainer.appendChild(clientDiv);
  });

  function onClientClick(client, clientIcon) {
    // Clear the 'selected' class from all icons
    const icons = clientsContainer.querySelectorAll('.client img');
    icons.forEach(icon => {
        icon.classList.remove('selected');
    });

    clientIcon.classList.add('selected');

    handleChat(client.ip);
  }
}

function handleChat(hostname) {
  const txtInput = document.getElementById('txtInput');
  const chatBody = document.getElementById('chatBody');
  chatBody.style.display = 'block'

  txtInput.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        renderUserMessage();
      }
    });

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

displayClients();
