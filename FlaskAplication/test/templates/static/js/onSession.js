let chatVisible = false;
let selectedClient = null;





async function displayClients() {
  const response = await fetch('/listShellConnections', {
    method: 'GET'
  });
  const clients = await response.json();
  const clientsContainer = document.getElementById('clients-container');

  for (let ip in clients) {
    console.log(ip);
    const clientDiv = document.createElement('div');
    clientDiv.className = 'client';

    const clientIcon = document.createElement('i');
    clientIcon.className = 'fa-brands fa-windows';
    clientIcon.style.color = '#49da3e';
    clientIcon.addEventListener('click', () => onClientClick(ip, clientIcon));
    clientDiv.appendChild(clientIcon);

    const clientIp = document.createElement('div');
    clientIp.className = 'client-ip';
    clientIp.textContent = ip;
    clientDiv.appendChild(clientIp);

    clientsContainer.appendChild(clientDiv);
  }

  function onClientClick(ip, clientIcon) {
    const icons = clientsContainer.querySelectorAll('.client img');
    icons.forEach(icon => {
      icon.classList.remove('selected');
    });

    if (selectedClient !== ip) {
      clientIcon.classList.add('selected');
      handleChat(ip);
      chatVisible = true;
    } else {
      toggleChatVisibility();
    }

    selectedClient = chatVisible ? ip : null;
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