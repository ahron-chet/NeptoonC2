  class MainContainer {
    constructor(id) {
        this.mainContainer = this.createMainContainer(id);
        this.FormPishContainer = null;
        this.SenderArea = null;
        this.fileContent = null;
        this.fileName = null;
        this.content = null;
    }

    createMainContainer(id) {
        const old = document.getElementById(id);
        if (old){
            old.remove();
        }
        const mainContainer = this.createHTMLElement('div', id, '');
        mainContainer.style.position = 'relative';
        mainContainer.style.zIndex = '1000';
        document.body.appendChild(mainContainer);
        return mainContainer;
    }

    creatFormPishContainer(){
        this.FormPishContainer = this.createHTMLElement('div', '', 'FormPishContainer');
        const h1 = this.createHTMLElement('h1', 'H1Gophish', '');
        this.FormPishContainer.appendChild(h1);
        this.SenderArea = this.createHTMLElement('div', 'SenderArea', 'SenderArea');
        while (this.SenderArea.firstChild) {
            this.SenderArea.removeChild(this.SenderArea.firstChild);
          }
        SenderArea.appendChild(FormPishContainer);
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
        const emailSenderArea = this.createEmailSenderArea();
        this.mainContainer.appendChild(editor);
        this.mainContainer.appendChild(emailSenderArea);
        document.body.appendChild(this.mainContainer);
    }

    createMailForm() {
        this.creatFormPishContainer();
        const form = this.createHTMLElement('form', '', '');
        const inputFrom = this.createInputElement('text', '', 'From', 'From', '');
        const inputTo = this.createInputElement('text', '', 'To', 'To', '');
        const inputSubject = this.createInputElement('text', '', 'Subject', 'Subject', '');
        const toggleEditorButton = this.createButtonElement('editor-toggle', 'Toggle Editor');
        const textareaBody = this.createInputElement('textarea', 'body', '', 'Add your Email body message...', '');
        const inputDeliveryNotificationOption = this.createInputElement('text', '', 'DeliveryNotificationOption', 'DeliveryNotificationOption', '');
        const submitButton = this.createInputElement('submit', 'sendEmailAction', '', '', 'Send');

        form.appendChild(inputFrom);
        form.appendChild(inputTo);
        form.appendChild(inputSubject);
        form.appendChild(toggleEditorButton);
        form.appendChild(textareaBody);
        form.appendChild(inputDeliveryNotificationOption);
        form.appendChild(submitButton);
        this.FormPishContainer.appendChild(form)
    }

    getTemplate(){
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
                setup: function (editor) {
                    editor.on('init', function () {
                        var attachmentBar = document.createElement('div');
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
                        onAction: function () {
                            var input = document.createElement('input');
                            input.setAttribute('type', 'file');
                            input.onchange = function () {
                                var file = this.files[0];
                                var reader = new FileReader();
                                reader.onload = function (event) {
                                    let base64String = event.target.result.split(',')[1];
                                    console.log(base64String);
                                };
                                reader.onerror = function (event) {
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
            this.content = document.getElementById('body').value;
        });

        sendBtn.addEventListener('click', (event) => {
            event.preventDefault();
            const payload = {
                html: this.content ? this.content : '',
                fileName: this.fileName ? this.fileName : '',
                fileContent: this.fileContent ? this.fileContent : ''
            };
            console.log(payload);
        });
    }

    mailAction(){

    }
}







class SmsEditor {
    constructor(mainContainerclc) {
        this = mainContainerclc
        this.createSmsEditor();
        this.addEventListeners();
    }

    createSmsEditor() {
        const smsSenderArea = this.createSmsSenderArea();
        this.mainContainer.appendChild(smsSenderArea);
        document.body.appendChild(this.mainContainer);
    }

    createSmsSenderArea() {
        const smsSenderArea = this.createHTMLElement('div', 'SmsSenderArea', 'SmsSenderArea');
        const formSmsContainer = this.createFormSmsContainer();
        smsSenderArea.appendChild(formSmsContainer);
        return smsSenderArea;
    }

    createFormSmsContainer() {
        const formSmsContainer = this.createHTMLElement('div', '', 'FormSmsContainer');
        const form = this.createForm();
        if (!document.getElementById('H1Gophish')){
            const h1 = this.createHTMLElement('h1', 'H1Gophish', '');
            h1.innerText = 'Phishing Time!!';
            formSmsContainer.appendChild(h1);
        }
        formSmsContainer.appendChild(form);
        return formSmsContainer;
    }

    createForm() {
        const form = this.createHTMLElement('form', '', '');
        const inputFrom = this.createInputElement('text', '', 'From', 'From', '');
        const inputTo = this.createInputElement('text', '', 'To', 'To', '');
        const textareaBody = this.createInputElement('textarea', 'body', '', 'Add your sms body message...', '');
        const key = this.createInputElement('password', 'Key', '', 'Enter nexmo/Vonage key.', '');
        const secret = this.createInputElement('password', 'Secret', '', 'Enter nexmo/Vonage secret.', '');
        const submitButton = this.createInputElement('submit', 'SendSms', '', '', 'Send');

        form.appendChild(key);
        form.appendChild(secret);
        form.appendChild(inputFrom);
        form.appendChild(inputTo);
        form.appendChild(textareaBody);
        form.appendChild(submitButton);
        return form;
    }

    addEventListeners() {
        const sendBtn = document.getElementById('SendSms');

        sendBtn.addEventListener('click', (event) => {
            event.preventDefault();
            console.log("test");
        });
    }
}
