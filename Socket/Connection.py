
class Connection(object):
    
    def __init__(self, conn=None, addr=None, host=None, aes=None):
        self.conn = conn
        self.addr = addr
        self.aes = aes
        self.host = host
        self.ip = None
        self.key = None
        self.IV = None
        self.reset()

    def reset(self):
        if self.aes:
            self.key = self.aes.key
            self.IV = self.aes.iv
        if self.addr:
            self.ip = self.addr[0]
