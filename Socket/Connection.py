

class Connection(object):
    
    def __init__(self, conn=None, hostname=None, aes=None, ip=None):
        self.conn = conn
        self.aes = aes
        self.hostname = hostname
        self.ip = ip