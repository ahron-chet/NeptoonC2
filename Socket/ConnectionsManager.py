from os import urandom
from .Connection import Connection


class ConnectionManager(object):


    def __init__(self):
        self.connections = {}
        self.connectedObjects = {}
        self.connctTo = None


    def insertNewConnction(self,conn):
        ip = conn.getpeername()[0]
        if ip not in self.connections.keys(): 
            self.connections[ip] = {
                'hostName': "test",
                'connected': False,
            }

    def connectToTarget(self,conn):
        conn.send(urandom(16))
        ip = conn.getpeername()[0]
        self.connections[ip]['connected'] = True
        self.connectedObjects[ip] = Connection(conn=conn,host='test')
    

    def addAesToconnection(self,conn, aesObj):
        aesObj.set_iv(aesObj.key)
        self.connectedObjects[conn.getpeername()[0]].aes = aesObj

        

    def removeConnection(self,conn):
        del self.connections[conn.getpeername()]
        
    def getFixedConnection(self,conn):
        return self.connectedObjects[conn.getpeername()[0]]
    
    def isconnected(self,ip):
        return self.connections['connected']
    
    def getConnObj(self,ip):
        return self.connectedObjects[ip]
