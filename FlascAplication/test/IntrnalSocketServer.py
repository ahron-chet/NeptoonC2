import socket

class IntrnalSocketServer(object):

    def __init__(self, host='127.0.0.1', port=65432):
        self._host = host
        self._port = port
        self._server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self._conn = None

    def _read_msg(self):
        header = int.from_bytes(self._conn.recv(4))
        res = self._conn.recv(header)
        while len(res) < header:
            res += self._conn.recv(header-len(res))
        return res

    def _send_msg(self, msg):
        self._conn.send(
            int.to_bytes(
                len(msg),
                length=4,
                byteorder='big',
            ) + msg
        )

    def start(self):
        self._server.bind((self._host, self._port))
        self._server.listen(1)
        self._conn,_ = self._server.accept()