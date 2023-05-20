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

    initializeTinyMCE() {
        tinymce.init({
            selector: '#tiny',
            plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount code template preview fullscreen',
            toolbar: 'code | template | preview | addAttachment | blocks fontfamily fontsize | bold italic underline strikethrough | fullscreen | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
            templates : [
                {"title": "Google Security alert", "content": "<table lang=\"en\" style=\"min-width: 348px;\" border=\"0\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\"> <tbody> <tr style=\"height: 32px;\"> <td>&nbsp;</td> </tr> <tr align=\"center\"> <td> <div> <div>&nbsp;</div> </div> <table style=\"padding-bottom: 20px; max-width: 516px; min-width: 220px;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"> <tbody> <tr> <td style=\"width: 8px;\" width=\"8\">&nbsp;</td> <td> <div class=\"mdv2rw\" style=\"border-radius: 8px; padding: 40px 20px; border: thin solid #dadce0;\" align=\"center\"><img style=\"margin-bottom: 16px;\" src=\"https://www.gstatic.com/images/branding/googlelogo/2x/googlelogo_color_74x24dp.png\" alt=\"Google\" width=\"74\" height=\"24\" aria-hidden=\"true\"> <div style=\"font-family: 'Google Sans', Roboto, RobotoDraft, Helvetica, Arial, sans-serif; border-bottom: thin solid #dadce0; color: rgba(0,0,0,0.87); line-height: 32px; padding-bottom: 24px; text-align: center; word-break: break-word;\"> <div style=\"font-size: 24px;\">Your password was changed</div> <table style=\"margin-top: 8px;\" align=\"center\"> <tbody> <tr style=\"line-height: normal;\"> <td style=\"padding-right: 8px;\" align=\"right\"><img style=\"width: 20px; height: 20px; vertical-align: sub; border-radius: 50%;\" src=\"https://lh3.googleusercontent.com/a/AEdFTp7usAxRM46mekVWJGi-tH9DvMxLNrSQb3S9Xef0=s96\" alt=\"\" width=\"20\" height=\"20\"></td> <td><a style=\"font-family: 'Google Sans', Roboto, RobotoDraft, Helvetica, Arial, sans-serif; color: rgba(0,0,0,0.87); font-size: 14px; line-height: 20px;\">{User@email}/a></td> </tr> </tbody> </table> </div> <div style=\"font-family: Roboto-Regular, Helvetica, Arial, sans-serif; font-size: 14px; color: rgba(0,0,0,0.87); line-height: 20px; padding-top: 20px; text-align: left;\">The password for your Google account tiranduek95@gmail.com was changed. If you didn't change it, you should <a style=\"text-decoration: none; color: #4285f4;\" href=\"https://accounts.google.com/RecoverAccount?fpOnly=1&amp;source=ancp&amp;Email=tiranduek95@gmail.com&amp;et=0\" target=\"_blank\" rel=\"noopener\" data-meta-key=\"recover-account\">recover your account</a>.</div> <div style=\"padding-top: 20px; font-size: 12px; line-height: 16px; color: #5f6368; letter-spacing: 0.3px; text-align: center;\">You can also see security activity at<br><a style=\"color: rgba(0, 0, 0, 0.87); text-decoration: inherit;\">https://myaccount.google.com/notifications</a></div> </div> <div style=\"text-align: left;\"> <div style=\"font-family: Roboto-Regular, Helvetica, Arial, sans-serif; color: rgba(0,0,0,0.54); font-size: 11px; line-height: 18px; padding-top: 12px; text-align: center;\"> <div>You received this email to let you know about important changes to your Google Account and services.</div> <div style=\"direction: ltr;\">&copy; 2022 Google LLC, <a class=\"afal\" style=\"font-family: Roboto-Regular, Helvetica, Arial, sans-serif; color: rgba(0,0,0,0.54); font-size: 11px; line-height: 18px; padding-top: 12px; text-align: center;\">1600 Amphitheatre Parkway, Mountain View, CA 94043, USA</a></div> </div> </div> </td> <td style=\"width: 8px;\" width=\"8\">&nbsp;</td> </tr> </tbody> </table> </td> </tr> <tr style=\"height: 32px;\"> <td>&nbsp;</td> </tr> </tbody> </table>", "description": "Security Alert from google."},
                {"title": "Paypal Security alert", "content": "<html><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\"><meta name=\"viewport\" content=\"initial-scale=1,minimum-scale=1,maximum-scale=1,width=device-width,height=device-height,target-densitydpi=device-dpi,user-scalable=no\"><title>Login notification from PayPal</title><link href=\"https://fonts.googleapis.com/css?family=Noto+Sans:400,400italic,700,700italic&subset=latin,greek,greek-ext,devanagari,vietnamese,cyrillic-ext,latin-ext,cyrillic\" rel=\"stylesheet\" type=\"text/css\"><style type=\"text/css\">Begin Styles -->@font-face{font-family:pp-sans-big-light;font-weight:100;font-style:normal;src:url(https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansBig-Light.woff) format(\"woff\"),url(https://www.paypalobjects.com/webstatic/mktg/2014design/font/headlinedark/festivo1.ttf) format(\"truetype\"),url(https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansBig-Light.svg) format(\"svg\")}@font-face{font-family:pp-sans-big-bold;src:url(https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansBig-Bold.woff) format(\"woff\"),url(https://www.paypalobjects.com/webstatic/mktg/2014design/font/headlinedark/festivo1.ttf) format(\"truetype\"),url(https://www.paypalobjects.com/webstatic/mktg/2014design/font/PP-Sans/PayPalSansBig-Bold.svg) format(\"svg\")}.ppsans{font-family:pp-sans-big-light,'Noto Sans',Calibri,Trebuchet,Arial,sans serif!important}.ppsansbold{font-family:pp-sans-big-bold,'Noto Sans',Calibri,Trebuchet,Arial,sans serif!important}*{-webkit-text-size-adjust:none}.ExternalClass *{line-height:100%}td{mso-line-height-rule:exactly}body{margin:0!important}div[style*=\"margin: 16px 0\"]{margin:0!important}.greyLink a:link{color:#949595}.applefix a{color:inherit;text-decoration:none}a{color:#0070ba!important}.neptuneButtonWhite a{color:#fff!important}.neptuneButtonBlue a{color:#0070ba!important}.pisces-menu a{color:#086a87!important}@media only screen and (max-width:414px){body{width:100%;min-width:100%;position:relative;top:0;left:0;right:0;margin:0;padding:0}.marginFix{position:relative;top:0;left:0;right:0}.mobContent{width:100%!important;min-width:100%!important;padding:0!important}.hide{width:0!important;height:0!important;display:none!important}.full-width{width:100%!important;min-width:100%!important}.stackTbl{width:100%!important;display:table!important}.stackTblMarginTop{width:100%!important;display:table!important;margin-top:20px!important}.center{margin:0 auto!important}.floatLeft{float:left!important;width:35%!important}.floatRight{float:right!important;width:60%!important}.autoHeight{height:auto!important}.autoWidth{width:auto!important}.mobilePadding{padding:20px 20px 20px 20px!important}.mobilePadding1{padding:40px 20px 40px 20px!important;height:auto!important}.mobilePadding2{padding:0 20px 40px 20px!important}.mobilePadding3{padding:20px 20px 0 20px!important}.mobilePadding4{padding:0 0 30px 0!important}.mobilePadding5{padding:0 20px 30px 20px!important}.mobilePadding6{padding:30px 20px 30px 20px!important}.mobilePadding7{padding:0 20px 0 20px!important}.mobilePadding8{padding:50px 0 50px 0!important}.mobilePadding9{padding:10px 0 15px 0!important}.mobilePadding10{padding:0 20px 0 20px!important}.mobilePadding11{padding:40px 0 40px 0!important}.mobilePadding12{padding:40px 0 0 0!important}.mobilePadding13{padding:0 0 40px 0!important}.mobilePadding14{padding:40px 30px 10px 30px!important}.mobilePadding15{padding:0 30px 0 30px!important}.mobilePadding16{padding:0 0 10px 0!important}.mobilePadding17{padding:0 0 30px 0!important}.padding0{padding:0!important}.topPadding0{padding-top:0!important}.topPadding10{padding-top:10px!important}.topPadding20{padding-top:20px!important}.topPadding30{padding-top:30px!important}.topPadding40{padding-top:40px!important}.bottomPadding0{padding-bottom:0!important}.bottomPadding10{padding-bottom:10px!important}.bottomPadding20{padding-bottom:20px!important}.bottomPadding30{padding-bottom:30px!important}.bottomPadding40{padding-bottom:40px!important}.fullWidthImg{width:100%!important;height:auto!important;min-width:100%!important}.bgSwap{background-image:url(images/lifestyle-background-mob.jpg)!important;width:100%!important;padding-top:65%!important;background-size:cover!important;background-position:center top!important;background-repeat:no-repeat!important;display:block!important}.borderBottomDot{border-bottom:1px dotted #999!important}.textAlignLeft{text-align:left!important}.textAlignRight{text-align:right!important}.textAlignCenter{text-align:center!important}.mobileStrong{font-weight:700!important}.td150px{width:150px!important}.td130px{width:130px!important}.td120px{width:120px!important}.td100px{width:100px!important}.imgWidth10px{width:10px!important}}.mpidiv img{width:100%!important;height:auto!important;min-width:100%!important;max-width:100%!important}.partner_image{max-width:250px!important;max-height:90px!important;display:block}</style><style type=\"text/css\"></style><!--[if gt mso 9]><style type=\"text/css\">.ppsans{font-family:Calibri,Trebuchet,Arial,sans serif!important}</style><![endif]--></head><body style=\"padding:0;margin:0;background:#f2f2f2\"><div style=\"display:none;display:none!important;color:#fff;font-size:1pt\"></div><span style=\"display:none!important;font-size:0;line-height:0;color:#fff\">Login from new device.</span><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" class=\"marginFix\"><tr><td bgcolor=\"#ffffff\" class=\"mobMargin\" style=\"font-size:0\"></td><td bgcolor=\"#ffffff\" width=\"660\" align=\"center\" class=\"mobContent\"><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\"><tr><td class=\"hide\"></td><td align=\"center\" width=\"600\"><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" bgcolor=\"#f5f5f5\"><tr><td align=\"center\" style=\"font-family:Calibri,Trebuchet,Arial,sans serif;font-size:14px;line-height:18px;color:#777;padding:20px\" class=\"ppsans\">Hello, Tiran Duek</td></tr></table><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" bgcolor=\"#f5f5f5\"><tr><td align=\"center\"><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td></td><td width=\"117\" align=\"center\" valign=\"bottom\"><img src=\"https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/pplogo-circletop-sm.png\" width=\"117\" height=\"16\" style=\"display:block\" border=\"0\" alt=\"\"></td><td></td></tr></table></td></tr></table></td><td class=\"hide\"></td></tr></table><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\"><tr><td class=\"mobMargin\"></td><td align=\"center\" width=\"600\"><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td></td><td width=\"117\" align=\"center\"><img src=\"https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/pp-logo.jpg\" width=\"117\" height=\"71\" style=\"display:block\" border=\"0\" alt=\"PayPal\" title=\"PayPal\"></td><td></td></tr></table></td><td class=\"mobMargin\"></td></tr><tr dir=\"LTR\"><td class=\"mobMargin\" align=\"center\" valign=\"top\" bgcolor=\"#004f9b\"><img src=\"https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/header-sidebar-left-top.jpg\" width=\"100%\" height=\"81\" style=\"display:block\" border=\"0\" alt=\"\"></td><td dir=\"LTR\" align=\"center\" width=\"600\" bgcolor=\"#004f9b\"><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" dir=\"LTR\"><tr><td width=\"12\" align=\"center\" valign=\"top\"><img src=\"https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/header-left-corner.jpg\" width=\"12\" height=\"81\" style=\"display:block\" border=\"0\" alt=\"\"></td><td align=\"center\" valign=\"top\"><img src=\"https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/header-left.jpg\" width=\"100%\" height=\"81\" style=\"display:block\" border=\"0\" alt=\"\"></td><td width=\"117\" align=\"center\" valign=\"top\"><img src=\"https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/header-center-circle.jpg\" width=\"100%\" height=\"81\" style=\"display:block\" border=\"0\" alt=\"\"></td><td align=\"center\" valign=\"top\"><img src=\"https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/header-right.jpg\" width=\"100%\" height=\"81\" style=\"display:block\" border=\"0\" alt=\"\"></td><td width=\"12\" align=\"center\" valign=\"top\"><img src=\"https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/header-right-corner.jpg\" width=\"12\" height=\"81\" style=\"display:block\" border=\"0\" alt=\"\"></td></tr></table></td><td class=\"mobMargin\" align=\"center\" valign=\"top\" bgcolor=\"#004f9b\"><img src=\"https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/header-sidebar-right-top.jpg\" width=\"100%\" height=\"81\" style=\"display:block\" border=\"0\" alt=\"\"></td></tr><tr><td class=\"mobMargin\" align=\"left\" valign=\"top\"><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td align=\"center\" valign=\"top\" bgcolor=\"#004f9b\"><img src=\"https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/header-sidebar-left-bottom.jpg\" width=\"100%\" height=\"96\" style=\"display:block\" border=\"0\" class=\"imgWidth10px\" alt=\"\"></td></tr><tr><td bgcolor=\"#ffffff\" align=\"right\" valign=\"top\"><img src=\"https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/sidebar-gradient.png\" width=\"1\" height=\"100\" style=\"display:block\" alt=\"\"></td></tr></table></td><td width=\"600\" valign=\"top\" align=\"center\"><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td align=\"center\" valign=\"top\" bgcolor=\"#ffffff\" style=\"padding-top:20px\"><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td align=\"center\" style=\"padding:0 30px 30px 30px\"><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td align=\"center\" valign=\"top\" style=\"font-family:Calibri,Trebuchet,Arial,sans serif;font-size:36px;line-height:44px;color:#333\" class=\"ppsans\">New login to PayPal</td></tr></table></td></tr></table><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td align=\"center\" style=\"padding:0 30px 30px 30px\"><table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tr><td align=\"center\" style=\"vertical-align:top;padding:0;font-family:Calibri,Trebuchet,Arial,sans serif;font-size:19px;line-height:24px;color:#777\" class=\"ppsans\">We noticed a new login with your PayPal account associated with piratebuy1@gmail.com from a device we don't recognize.</td></tr></table></td></tr></table><table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody><tr><td align=\"center\" style=\"padding:30px 30px 30px 30px\"><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td align=\"center\" valign=\"top\" style=\"font-size:0;line-height:0;border-bottom:1px solid #d6d6d6\"></td></tr></table></td></tr></tbody></table><table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody><tr><td align=\"center\" style=\"padding:0 30px 10px 30px\"><table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tr><td align=\"center\" style=\"font-family:Calibri,Trebuchet,Arial,sans serif;font-size:17px;line-height:22px;color:#333\" class=\"ppsans mobilePadding16\"><p>Android PayPal App</p><p>November 22, 11:11 AM PST</p><p>Israel</p></td></tr></table></td></tr></tbody></table><table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody><tr><td align=\"center\" style=\"padding:10px 30px 30px 30px\"><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td align=\"center\" valign=\"top\" style=\"font-size:0;line-height:0;border-bottom:1px solid #d6d6d6\"></td></tr></table></td></tr></tbody></table><table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody><tr><td align=\"center\" style=\"padding:0 30px 30px 30px\"><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td valign=\"top\" style=\"font-family:Calibri,Trebuchet,Arial,sans serif;font-size:17px;line-height:22px;color:#333\" class=\"ppsans\"><p style=\"\">If this wasn\u2019t you, please<a href=\"https://www.paypal.com/myaccount/settings/password/edit/?utm_source=unp&utm_medium=email&utm_campaign=PPC001733&utm_unptid=f35b5bf6-0d5b-11ea-bea2-b875c01ea9f9&ppid=PPC001733&cnac=IL&rsta=en_AD&cust=BBRVWMXQRXSPN&unptid=f35b5bf6-0d5b-11ea-bea2-b875c01ea9f9&calc=88d460b796538&unp_tpcid=new-device-email-notification&page=main:email:PPC001733:::&pgrp=main:email&e=cl&mchn=em&s=ci&mail=sys\" islinktobetracked=\"True\" style=\"text-decoration:none\" target=\"_BLANK\">change your password</a>immediately and review your account for unauthorized activity.</p></td></tr></table></td></tr></tbody></table><table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody><tr><td align=\"center\" style=\"padding:0 30px 30px 30px\"><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td valign=\"top\" style=\"font-family:Calibri,Trebuchet,Arial,sans serif;font-size:17px;line-height:22px;color:#333\" class=\"ppsans\"><p>Thanks,</p><p>PayPal</p></td></tr></table></td></tr></tbody></table></td></tr></table></td><td valign=\"top\" align=\"left\" class=\"mobMargin\"><table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody><tr><td valign=\"top\" bgcolor=\"#004f9b\" align=\"center\"><img width=\"100%\" border=\"0\" height=\"96\" class=\"imgWidth10px\" style=\"display:block\" src=\"https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/header-sidebar-right-bottom.jpg\"></td></tr><tr><td valign=\"top\" bgcolor=\"#ffffff\" align=\"left\"><img width=\"1\" height=\"100\" style=\"display:block\" src=\"https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/sidebar-gradient.png\"></td></tr></tbody></table></td></tr></table><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" dir=\"LTR\"><tr><td class=\"mobMargin\"></td><td align=\"center\" width=\"600\"><table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tr><td align=\"left\" style=\"vertical-align:top;padding:0\"><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td width=\"12\" align=\"center\" valign=\"top\"><img src=\"https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/footer-left-corner.jpg\" width=\"12\" height=\"141\" style=\"display:block\" border=\"0\" alt=\"\"></td><td align=\"center\" valign=\"top\"><img src=\"https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/footer-left-stroke.jpg\" width=\"100%\" height=\"141\" style=\"display:block\" border=\"0\" alt=\"\"></td><td width=\"120\" align=\"center\" valign=\"top\"><img src=\"https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/footer-pp-logo.jpg\" width=\"120\" height=\"141\" style=\"display:block\" border=\"0\" alt=\"PayPal\"></td><td align=\"center\" valign=\"top\"><img src=\"https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/footer-right-stroke.jpg\" width=\"100%\" height=\"141\" style=\"display:block\" border=\"0\" alt=\"\"></td><td width=\"12\" align=\"center\" valign=\"top\"><img src=\"https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/footer-right-corner.jpg\" width=\"12\" height=\"141\" style=\"display:block\" border=\"0\" alt=\"\"></td></tr></table><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td align=\"center\" style=\"font-family:Calibri,Trebuchet,Arial,sans serif;font-size:15px;line-height:22px;color:#444;padding:20px\" class=\"ppsans\"><a href=\"https://www.paypal.com/selfhelp/home?utm_source=unp&utm_medium=email&utm_campaign=PPC001733&utm_unptid=f35b5bf6-0d5b-11ea-bea2-b875c01ea9f9&ppid=PPC001733&cnac=IL&rsta=en_AD&cust=BBRVWMXQRXSPN&unptid=f35b5bf6-0d5b-11ea-bea2-b875c01ea9f9&calc=88d460b796538&unp_tpcid=new-device-email-notification&page=main:email:PPC001733:::&pgrp=main:email&e=cl&mchn=em&s=ci&mail=sys\" target=\"_blank\" style=\"color:#0070ba;text-decoration:none\" alt=\"Help & Contact\">Help & Contact</a>|<a href=\"https://www.paypal.com/il/webapps/mpp/paypal-safety-and-security?utm_source=unp&utm_medium=email&utm_campaign=PPC001733&utm_unptid=f35b5bf6-0d5b-11ea-bea2-b875c01ea9f9&ppid=PPC001733&cnac=IL&rsta=en_AD&cust=BBRVWMXQRXSPN&unptid=f35b5bf6-0d5b-11ea-bea2-b875c01ea9f9&calc=88d460b796538&unp_tpcid=new-device-email-notification&page=main:email:PPC001733:::&pgrp=main:email&e=cl&mchn=em&s=ci&mail=sys\" target=\"_blank\" style=\"color:#0070ba;text-decoration:none\" alt=\"Security\">Security</a>|<a href=\"https://www.paypal.com/il/webapps/mpp/mobile-apps?utm_source=unp&utm_medium=email&utm_campaign=PPC001733&utm_unptid=f35b5bf6-0d5b-11ea-bea2-b875c01ea9f9&ppid=PPC001733&cnac=IL&rsta=en_AD&cust=BBRVWMXQRXSPN&unptid=f35b5bf6-0d5b-11ea-bea2-b875c01ea9f9&calc=88d460b796538&unp_tpcid=new-device-email-notification&page=main:email:PPC001733:::&pgrp=main:email&e=cl&mchn=em&s=ci&mail=sys\" target=\"_blank\" style=\"color:#0070ba;text-decoration:none\" alt=\"Apps\">Apps</a></td></tr></table></td></tr></table></td><td class=\"mobMargin\"></td></tr></table><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td align=\"center\" style=\"padding-bottom:20px\"><table align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td align=\"left\" valign=\"middle\" style=\"padding:0 25px 0 0\"><a href=\"https://twitter.com/PayPal_Israel?utm_source=unp&utm_medium=email&utm_campaign=PPC001733&utm_unptid=f35b5bf6-0d5b-11ea-bea2-b875c01ea9f9&ppid=PPC001733&cnac=IL&rsta=en_AD&cust=BBRVWMXQRXSPN&unptid=f35b5bf6-0d5b-11ea-bea2-b875c01ea9f9&calc=88d460b796538&unp_tpcid=new-device-email-notification&page=main:email:PPC001733:::&pgrp=main:email&e=cl&mchn=em&s=ci&mail=sys\" target=\"_blank\"><img border=\"0\" src=\"https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/icon-tw.jpg\" width=\"28\" height=\"29\" style=\"display:block\" alt=\"twitter\"></a></td><td align=\"left\" valign=\"middle\" style=\"padding:0 25px 0 0\"><a href=\"https://www.instagram.com/paypal/?utm_source=unp&utm_medium=email&utm_campaign=PPC001733&utm_unptid=f35b5bf6-0d5b-11ea-bea2-b875c01ea9f9&ppid=PPC001733&cnac=IL&rsta=en_AD&cust=BBRVWMXQRXSPN&unptid=f35b5bf6-0d5b-11ea-bea2-b875c01ea9f9&calc=88d460b796538&unp_tpcid=new-device-email-notification&page=main:email:PPC001733:::&pgrp=main:email&e=cl&mchn=em&s=ci&mail=sys\" target=\"_blank\"><img border=\"0\" src=\"https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/icon-ig.jpg\" width=\"28\" height=\"29\" style=\"display:block\" alt=\"instagram\"></a></td><td align=\"left\" valign=\"middle\" style=\"padding:0 25px 0 0\"><a href=\"https://www.facebook.com/PayPalIsrael?utm_source=unp&utm_medium=email&utm_campaign=PPC001733&utm_unptid=f35b5bf6-0d5b-11ea-bea2-b875c01ea9f9&ppid=PPC001733&cnac=IL&rsta=en_AD&cust=BBRVWMXQRXSPN&unptid=f35b5bf6-0d5b-11ea-bea2-b875c01ea9f9&calc=88d460b796538&unp_tpcid=new-device-email-notification&page=main:email:PPC001733:::&pgrp=main:email&e=cl&mchn=em&s=ci&mail=sys\" target=\"_blank\"><img border=\"0\" src=\"https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/icon-fb.jpg\" width=\"28\" height=\"29\" style=\"display:block\" alt=\"facebook\"></a></td><td align=\"left\" valign=\"middle\" style=\"padding:0 25px 0 0\"><a href=\"http://www.linkedin.com/company/1482?trk=tyah&utm_source=unp&utm_medium=email&utm_campaign=PPC001733&utm_unptid=f35b5bf6-0d5b-11ea-bea2-b875c01ea9f9&ppid=PPC001733&cnac=IL&rsta=en_AD&cust=BBRVWMXQRXSPN&unptid=f35b5bf6-0d5b-11ea-bea2-b875c01ea9f9&calc=88d460b796538&unp_tpcid=new-device-email-notification&page=main:email:PPC001733:::&pgrp=main:email&e=cl&mchn=em&s=ci&mail=sys\" target=\"_blank\"><img border=\"0\" src=\"https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/icon-li.jpg\" width=\"28\" height=\"29\" style=\"display:block\" alt=\"linkedin\"></a></td></tr></table></td></tr></table><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\"><tr><td class=\"hide\"></td><td align=\"center\" width=\"600\" valign=\"top\"></td><td class=\"hide\"></td></tr></table><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\"><tr><td class=\"hide\"></td><td align=\"center\" width=\"600\"><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td class=\"ppsans\" style=\"font-family:Calibri,Trebuchet,Arial,sans serif;font-size:13px;line-height:20px;color:#999;padding:20px 30px 30px 30px\"><span><p>PayPal is committed to preventing fraudulent emails. Emails from PayPal will always contain your full name.<a href=\"http://www.paypal.com/il/webapps/mpp/phishing?utm_source=unp&utm_medium=email&utm_campaign=PPC001733&utm_unptid=f35b5bf6-0d5b-11ea-bea2-b875c01ea9f9&ppid=PPC001733&cnac=IL&rsta=en_AD&cust=BBRVWMXQRXSPN&unptid=f35b5bf6-0d5b-11ea-bea2-b875c01ea9f9&calc=88d460b796538&unp_tpcid=new-device-email-notification&page=main:email:PPC001733:::&pgrp=main:email&e=cl&mchn=em&s=ci&mail=sys\" target=\"_blank\" style=\"color:#009cde;text-decoration:none\">Learn to identify phishing</a></p></span></td></tr></table></td><td class=\"hide\"></td></tr></table><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\"><tr><td class=\"hide\"></td><td align=\"center\" width=\"600\"><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td class=\"ppsans\" style=\"font-family:Calibri,Trebuchet,Arial,sans serif;font-size:13px;line-height:20px;color:#999;padding:20px 30px 30px 30px\"><span><p>Please don't reply to this email. To get in touch with us, click<strong><a href=\"https://www.paypal.com/selfhelp/home?utm_source=unp&utm_medium=email&utm_campaign=PPC001733&utm_unptid=f35b5bf6-0d5b-11ea-bea2-b875c01ea9f9&ppid=PPC001733&cnac=IL&rsta=en_AD&cust=BBRVWMXQRXSPN&unptid=f35b5bf6-0d5b-11ea-bea2-b875c01ea9f9&calc=88d460b796538&unp_tpcid=new-device-email-notification&page=main:email:PPC001733:::&pgrp=main:email&e=cl&mchn=em&s=ci&mail=sys\" style=\"text-decoration:none\" target=\"_BLANK\">Help & Contact</a></strong>.</p></span></td></tr></table></td><td class=\"hide\"></td></tr></table><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\"><tr><td class=\"hide\"></td><td align=\"center\" width=\"600\"><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"font-family:Calibri,Trebuchet,Arial,sans serif;font-size:13px;line-height:20px;color:#999;padding:20px 30px 30px 30px\" class=\"ppsans\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" id=\"emailFooter\" width=\"100%\" style=\"font-family:Calibri,Trebuchet,Arial,sans serif;font-size:13px;line-height:20px;color:#999\" class=\"ppsans\"><tbody><tr><td><p>Copyright \u00a9 1999-2019 PayPal. All rights reserved.</p><p>Consumer advisory \u2013 PayPal Pte. Ltd., the holder of PayPal's stored value facility, does not require the approval of the Monetary Authority of Singapore. Users are advised to read the terms and conditions carefully.</p><p class=\"footer ppid\">PayPal PPC001733:1.2:88d460b796538</p></td></tr></tbody></table><img src=\"https://t.paypal.com/ts?v=1&ppid=PPC001733&cnac=IL&rsta=en_AD&cust=BBRVWMXQRXSPN&unptid=f35b5bf6-0d5b-11ea-bea2-b875c01ea9f9&calc=88d460b796538&unp_tpcid=new-device-email-notification&page=main:email:PPC001733:::&pgrp=main:email&e=op&mchn=em&s=ci&mail=sys\" alt=\"\" height=\"1\" width=\"1\" border=\"0\"></p></td></tr></table></td><td class=\"hide\"></td></tr></table></td><td bgcolor=\"#ffffff\" class=\"mobMargin\" style=\"font-size:0\"></td></tr></table></body></html>", "description": "Security Alert from Paypal."}
            ],
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