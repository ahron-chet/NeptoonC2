
class MainContainer {
    constructor(id) {
      this.mainContainer = this.createMainContainer(id);
      this.FormPishContainer = null;
      this.SenderArea = null;
      this.filesA = null;
      this.content = null;
    }
  
    createMainContainer(id) {
      const old = document.getElementById(id);
      if (old) {
        old.remove();
      }
      const mainContainer = this.createHTMLElement('div', id, '');
      mainContainer.style.position = 'relative';
      mainContainer.style.zIndex = '1000';
      document.body.appendChild(mainContainer);
      return mainContainer;
    }
  
    createFormPishContainer() {
      this.FormPishContainer = this.createHTMLElement('div', '', 'FormPishContainer');
      this.FormPishContainer.style = 'background-color: rgb(34 47 62 / 87%);border-radius: 10px;'
      const h1 = this.createHTMLElement('h1', 'H1Gophish', '');
      h1.innerText = 'Phishing Time!!';
      this.FormPishContainer.appendChild(h1);
      this.SenderArea = this.createHTMLElement('div', 'SenderArea', 'SenderArea');
      while (this.SenderArea.firstChild) {
        this.SenderArea.removeChild(this.SenderArea.firstChild);
      }
      const exitbtn = new ExitButton(this.SenderArea);
      exitbtn.creatExit(this.mainContainer);
      this.SenderArea.appendChild(this.FormPishContainer);
      this.mainContainer.appendChild(this.SenderArea);
    }
  
    createHTMLElement(elementType, id, className) {
      let element = document.createElement(elementType);
      element.id = id;
      element.className = className;
      return element;
    }
  
    createInputElement(type, id, name, placeholder, value) {
      let inputElement;
      if (type === 'textarea') {
        inputElement = this.createHTMLElement('textarea', id, '');
        inputElement.rows = '10';
        inputElement.cols = '30';
      } else {
        inputElement = this.createHTMLElement('input', id, '');
        inputElement.type = type;
      }
      inputElement.name = name;
      inputElement.placeholder = placeholder;
      inputElement.value = value;
      return inputElement;
    }
  
    createButtonElement(id, innerText) {
      let buttonElement = this.createHTMLElement('button', id, '');
      buttonElement.innerText = innerText;
      return buttonElement;
    }
  
    createEmailEditor() { 
      const editor = this.createHTMLElement('div', 'editor', '');
      editor.style.display = 'none';
      editor.style.position = 'absolute';
      editor.style.padding = '20px';
      editor.style.zIndex = '1000';
  
      const attachmentSection = this.createHTMLElement('div', 'attachmentSection', '');
      attachmentSection.style.fontSize = '50px';
      attachmentSection.style.zIndex = '10';
      attachmentSection.style.color = 'red';
  
      const textarea = this.createInputElement('textarea', 'tiny', '', 'Body', '');
      const addBodyButton = this.createButtonElement('AddHtmlToSend', 'Add Body');
  
      editor.appendChild(attachmentSection);
      editor.appendChild(textarea);
      editor.appendChild(addBodyButton);
      this.mainContainer.appendChild(editor);
    }
  
    createMailForm() {
      this.createFormPishContainer();
      const form = this.createHTMLElement('form', '', '');
      const inputFrom = this.createInputElement('text', 'FromUserMail', 'From', 'From', '');
      const inputPassword = this.createInputElement('password', 'MailPassword', 'Password', 'Password', '');
      const inputTo = this.createInputElement('text', 'InputToMail', 'To', 'To', '');
      const inputSubject = this.createInputElement('text', 'MailSubject', 'Subject', 'Subject', '');
      const toggleEditorButton = this.createButtonElement('editor-toggle', 'Toggle Editor');
      const textareaBody = this.createInputElement('textarea', 'body', '', 'Add your Email body message...', '');
      const submitButton = this.createInputElement('submit', 'sendEmailAction', '', '', 'Send');
      const smtp = this.createInputElement('text', 'SmtpServer', 'Smtp', 'Smtp Server (opt)', '');
      const port = this.createInputElement('text', 'PortMail', 'Port', 'Port (opt)', '');

      form.appendChild(inputFrom);
      form.appendChild(inputPassword);
      form.appendChild(inputTo);
      form.appendChild(inputSubject);
      form.appendChild(toggleEditorButton);
      form.appendChild(textareaBody);
      form.appendChild(smtp);
      form.appendChild(port);
      form.appendChild(submitButton);

      this.FormPishContainer.appendChild(form);
    }
  
    getTemplate() {
      return fetch("/Features/phishing/gettemplates")
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        });
    }
  
    initializeTinyMCE() {
      this.getTemplate().then(templates => {
        tinymce.init({
          selector: '#tiny',
          plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount code template preview fullscreen',
          toolbar: 'code | template | preview | addAttachment | blocks fontfamily fontsize | bold italic underline strikethrough | fullscreen | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
          templates: templates,
          setup: (editor) => {
            editor.on('init', () => {
              const attachmentBar = this.createHTMLElement('div', 'attachmentBar', '');
              attachmentBar.id = 'attachmentBar';
              attachmentBar.style.background = '#f0f0f0';
              attachmentBar.style.padding = '10px';
              attachmentBar.style.borderBottom = '1px solid #ccc';
              attachmentBar.textContent = 'Attachments: ';
              attachmentBar.style.display = 'none';
              editor.getContainer().prepend(attachmentBar);
            });
  
            editor.ui.registry.addButton('addAttachment', {
              text: 'Add Attachment',
              onAction: () => {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.onchange = () => {
                  const file = input.files[0];
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const base64String = event.target.result.split(',')[1];
                    this.filesA[file.split(/[/\\]/).pop()] = base64String;
                  };
                  reader.onerror = (event) => {
                    console.log("Error reading file: " + event.target.error);
                  };
                  reader.readAsDataURL(file);
                };
                input.click();
              }
            });
          }
        });
      }).catch(error => {
        console.error("Failed to initialize TinyMCE:", error);
      });
    }
  
    addEventListenersMail() {
      const toggleButton = document.getElementById('editor-toggle');
      const editorTextarea = document.getElementById('editor');
      const addHtmlToSend = document.getElementById('AddHtmlToSend');
      const sendBtn = document.getElementById('sendEmailAction');
  
      toggleButton.addEventListener('click', (event) => {
        event.preventDefault();
        editorTextarea.style.display = 'block';
      });
  
      addHtmlToSend.addEventListener('click', (event) => {
        event.preventDefault();
        this.content = tinyMCE.activeEditor.getContent();
        editorTextarea.style.display = 'none';
        document.getElementById('body').value = this.content;
      });
  
      sendBtn.addEventListener('click', (event) => {
        event.preventDefault();
        const required_fields = [
            'FromUserMail',
            'MailPassword',
            'InputToMail',
            'MailSubject',
            'body'
        ];
        let smtp_server = document.getElementById("SmtpServer").value;
        let portMail = document.getElementById("PortMail").value;
        const payload = {
          smtp_server: smtp_server ? smtp_server : null,
          port: portMail ? portMail : null,
          files: this.filesA
        }
        let fixed = true;
        for(let i of required_fields){
            const div = document.getElementById(i);
            if (div.value.length === 0){
              div.style = 'border: 1px solid #fd0000 !important;';
              fixed = false;
            }
            else{
              div.style = '';
              payload[i]=div.value;
            }
        } 
        if(!fixed){
            return;
        }
        this.SendPhishing(payload,'mail');
      });
    }

    mailOption() {
        this.createMailForm();
        this.createEmailEditor();
        this.initializeTinyMCE();
        this.addEventListenersMail();
    } 

    SendPhishing(payload,type){
      const status = new CreatStatusVX(this.SenderArea ,this.FormPishContainer);
      let endpoint;
      if (type === 'mail'){
        endpoint = '/features/phishing/send_mail';
      }
      const loader = new CreatLoader(this.SenderArea);
      this.FormPishContainer.style.display = 'none';
      loader.DisplayLoading();
      return fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload) 
      })
      .then(response => {
        loader.EndLoading();
        if(response.status == 401){
          alert("Worng user or password");
        }
        else if (!response.ok) {
          status.creatXmark();
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        else{
          status.creatSuccess();
        }
      })
    }
}
