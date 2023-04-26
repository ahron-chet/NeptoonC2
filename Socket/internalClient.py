import socket

class InternalSocketClient(object):

    def __init__(self, host='127.0.0.1', port=65432):
        self._host = host
        self._port = port
        self._client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self._client.connect((self._host, self._port))
        print('Connected to internal Server')

    def _read_msg(self):
        header = int.from_bytes(self._client.recv(4), byteorder='big')
        res = self._client.recv(header)
        while len(res) < header:
            res += self._client.recv(header - len(res))
        return res

    def _send_msg(self, msg):
        self._client.send(
            int.to_bytes(
                len(msg),
                length=4,
                byteorder='big',
            ) + msg
        )


    def close(self):
        self._client.close()
        
            
