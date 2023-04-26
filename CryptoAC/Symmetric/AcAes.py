from Cryptodome.Cipher import AES
from Cryptodome.Util.Padding import pad, unpad
from Cryptodome.Random import get_random_bytes
from hashlib import md5


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