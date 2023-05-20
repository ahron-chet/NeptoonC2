 class EmailEditor {
    constructor() {
        this.fileContent = null;
        this.fileName = null;
        this.content = null;
        this.mainContainer = this.createMainContainer();
        this.addEventListeners();
        this.initializeTinyMCE();
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

    createMainContainer() {
        const mainContainer = this.createHTMLElement('div', 'EmailSenderMainContainer', '');
        const editor = this.createEditor();
        const emailSenderArea = this.createEmailSenderArea();
        mainContainer.appendChild(editor);
        mainContainer.appendChild(emailSenderArea);
        document.body.appendChild(mainContainer);
        return mainContainer;
    }

    createEditor() {
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

        return editor;
    }

    createEmailSenderArea() {
        const emailSenderArea = this.createHTMLElement('div', 'emailSenderArea', 'emailSenderArea');
        const formEmailContainer = this.createFormEmailContainer();
        emailSenderArea.appendChild(formEmailContainer);
        return emailSenderArea;
    }

    createFormEmailContainer() {
        const formEmailContainer = this.createHTMLElement('div', '', 'FormEmailContainer');
        const h1 = this.createHTMLElement('h1', 'H1Gophish', '');
        h1.innerText = 'Phishing Time!!';
        const form = this.createForm();
        formEmailContainer.appendChild(h1);
        formEmailContainer.appendChild(form);
        return formEmailContainer;
    }

    createForm() {
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

        return form;
    }

    getTamplate(){
        return fetch("/Features/phishing/gettemplates")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        });
    }

    initializeTinyMCE() {
        tinymce.init({
            selector: '#tiny',
            plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount code template preview fullscreen',
            toolbar: 'code | template | preview | addAttachment | blocks fontfamily fontsize | bold italic underline strikethrough | fullscreen | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
            templates : this.getTamplate(),
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
    }
    addEventListeners() {
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
            const payload = {
                html: this.content ? this.content : '',
                fileName: this.fileName ? this.fileName : '',
                fileContent: this.fileContent ? this.fileContent : ''
            };
            console.log(payload);
        });
    }

}