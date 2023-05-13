from .CommandManager import CommandManager

class Connection(object):
    
    def __init__(self, conn=None, id=None, aes=None):
        self.conn = conn
        self.aes = aes
        self.id = id
        self.commandManager = CommandManager(self.sendMsg, self.recvMsg)


    def sendMsg(self, msg):
        if not msg:
            return
        msg = self.aes.encrypt(msg)
        self.conn.send(
            int.to_bytes(
                len(msg),
                length=4,
                byteorder='big',
            ) + msg
        )


    def recvMsg(self):
        if not self.commandManager.waitingForResult:
            return
        header = int.from_bytes(self.conn.recv(4))
        res = self.conn.recv(header)
        while len(res) < header:
            res += self.conn.recv(header-len(res))
        return self.aes.decrypt(res)
    