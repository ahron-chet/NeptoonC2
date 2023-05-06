from os import urandom
from .Connection import Connection
import json


class ConnectionManager(object):

    def __init__(self):
        self.connections = {}
        self.connectedObjects = {}
        self.connctTo = None

    def insertNewConnction(self, conn, clientInfo):
        ip = conn.getpeername()[0]
        if ip not in self.connections.keys(): 
            self.connections[ip] = self._parseClientInfo(clientInfo)

    def connectToTarget(self,conn):
        conn.send(urandom(16))
        ip = conn.getpeername()[0]
        name = self.connections[ip]['Hostname']
        self.connections[ip]['connected'] = True
        self.connectedObjects[ip] = Connection(conn=conn,hostname=name,ip=ip)
        self.connctTo = None


    def _parseClientInfo(self,clientInfo):
        return {**{'connected': False},**json.loads(clientInfo)}
    

    def addAesToconnection(self,conn, aesObj):
        aesObj.set_iv(aesObj.key)
        self.connectedObjects[conn.getpeername()[0]].aes = aesObj

    def removeConnection(self,conn):
        del self.connections[conn.getpeername()]
        
    def getFixedConnection(self,conn):
        return self.connectedObjects[conn.getpeername()[0]]
    
    def isconnected(self,ip):
        if ip not in self.connections.keys():
            return False
        return self.connections[ip]['connected']
    
    def getConnObj(self,ip):
        return self.connectedObjects[ip]
    
    def alive(self,ip):
        return ip in self.connections.keys()
    
    def getShellConntions(self):
        if not len(self.connectedObjects) > 0:
            return {}
        test = {
            self.connectedObjects[i].ip: self.connectedObjects[i].hostname
            for i in self.connectedObjects.keys()
        }
        print(test)
        return test
    
    def disconnect(self,ip):
        if ip in self.connectedObjects.keys():
            del self.connectedObjects[ip]
        self.connections[ip]['connected'] = False

