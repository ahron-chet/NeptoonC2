import socket
import argparse
import re

class Client(object):

    def __init__(self, host, id, port=8731):
        self.client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.client.connect((host, port))
        self.id = id

    def sendMsg(self, msg):
        self.client.send(
            int.to_bytes(
                len(msg),
                length=4,
                byteorder='big',
            ) + msg
        )

    def recvMsg(self):
        header = int.from_bytes(self.client.recv(4), byteorder='big')
        res = self.client.recv(header)
        while len(res) < header:
            res += self.client.recv(header-len(res))
        return res


    def getPwdandResult(self,first=False,lastout=None):
        if first:
            self.sendMsg(b"cd")
            lastout = self.recvMsg().decode(errors='replace')
        for i, n in enumerate(lastout):
            if n == ">":
                break
        return f"{lastout[:i].strip()}> ", lastout[i+1:]
    
    def _isPowershell(self, msg):
        if not len(msg) < 15 and len(msg) > 9:
            return False
        return msg.lower() in ("powershell", "powershell.exe")
        
    def start(self):
        self.sendMsg(self.id.encode())
        pwd,_ = self.getPwdandResult(first=True)
        while True:
            msg = input(pwd)
            if not msg: continue
            matchcd = re.match(r'^(cd|set-location)\s+([a-zA-Z0-9\s\.:\\_-]+)$', msg)
            if matchcd:
                msg = f"3f1ba9eb608addfb46dac5b51f4a6d87 {matchcd.groups()[-1]}"
            elif self._isPowershell(msg):
                msg = "adfd9a3aa5bc568d540db256a3782c04"
            self.sendMsg(msg.encode())
            res = self.recvMsg().decode(errors='replace')
            pwd, commandout = self.getPwdandResult(lastout=res)
            print(commandout)

    def stop(self):
        self.client.close()


def main():
    parser = argparse.ArgumentParser(description='Process id and ip.')
    parser.add_argument('--id', type=str, required=True)
    parser.add_argument('--ip', type=str, help='The IP address. If not provided, uses the host IP.')
    args = parser.parse_args()

    ip = args.ip if args.ip and args.ip != "local" else socket.gethostbyname(socket.gethostname())

    client = Client(ip, args.id)
    client.start()


if __name__=='__main__':
    main()