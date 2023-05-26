import os
import smtplib
import ssl
from email.message import EmailMessage
from base64 import b64decode

class MailSender(object):
    
    def __init__(self, user: str, password: str, use_ssl: bool = True):
        self.user = user
        self.password = password
        self.use_ssl = use_ssl
        self.msg = EmailMessage()
        self.smtp = None

    def attach_file(self, path: str = None, base64: str = None, name: str = None) -> None:
        if base64:
            assert(name), "File Name cant be empty."
            content = b64decode(base64)
            subtype = os.path.splitext(name)[-1]
        elif path and os.path.isfile(path) and os.path.getsize(path) > 0:
            with open(path, 'rb') as f:
                content = f.read()
            name = name if name else os.path.basename(path)
            subtype = os.path.splitext(path)[-1]
        else:
            return
        self.msg.add_attachment(content, maintype="application", subtype=subtype, filename=name)


    def create_sslcontext(self) -> ssl.SSLContext:
        if self.use_ssl:
            return ssl.create_default_context()    
        return ssl.SSLContext()

    def setup_message(self, to: str, subject: str, content: str, html_content: str, file: str) -> None:
        self.msg['Subject'] = subject
        self.msg['From'] = self.user
        self.msg['To'] = to
        if content:
            self.msg.set_content(content)
        if html_content:
            self.msg.add_alternative(html_content, subtype='html')
        if file:
            self.attach_file(file)

    def connect_to_smtp_server(self, smtp_server: str, port: int) -> None:
        context = self.create_sslcontext()
        self.smtp = smtplib.SMTP_SSL(smtp_server, port, context=context)
        assert self.smtp.login(self.user, self.password), 'Login Error'
        

    def send_email(self, to: str, subject: str, content: str = '', html_content: str = '', file: str = '', smtp_server: str = 'smtp.gmail.com', port: int = 465) -> bool:
        assert(content or html_content), "Email content cannot be empty."

        self.setup_message(to, subject, content, html_content, file)
        self.connect_to_smtp_server(smtp_server, port)
        try:
            self.smtp.send_message(self.msg)
            return True
        except Exception as e:
            print(f"Failed to send email. Error: {e}")
            return False
        finally:
            self.msg = EmailMessage()
            if self.smtp:
                self.smtp.quit()
