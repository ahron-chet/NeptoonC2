

class Connection(object):
    
    def __init__(self, conn=None, host=None, aes=None):
        self.conn = conn
        self.aes = aes
        self.host = host