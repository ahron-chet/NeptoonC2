import re
import sqlite3
from .Query import *
from os.path import isfile
from hashlib import md5
from datetime import datetime, timedelta


class DBActins(object):

    def __init__(self, db_path):
        self.db_path = db_path
        self.__resetor__()

    def is_valid_input(self, *strings):
        pattern = re.compile(r"^[a-zA-Z0-9_@.!#$%&*+-/=?^_`{|}~]+$")
        for string in strings:
            if not pattern.match(string):
                return False
        return True

    def create_login_table(self):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute(LOGINDB)
            conn.commit()

    def hash_password(self, password):
        if isinstance(password, str):
            password = password.encode()
        return md5(password).hexdigest()

    def insert_user(self, username, password):
        if not self.is_valid_input(username, password) or self.user_exists(username):
            return
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute(INSERTUSER, (username, self.hash_password(password)))
            conn.commit()

    def authenticate_user(self, username, password):
        if not self.is_valid_input(username, password):
            return False
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute(AUTHENTICATE, (username, self.hash_password(password)))
            data = cursor.fetchone()
            return data is not None

    def user_exists(self, username):
        if not self.is_valid_input(username):
            return False
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute(USEREXISTS, (username,))
            return cursor.fetchone() is not None

    def __resetor__(self):
        if not isfile(self.db_path):
            open(self.db_path, 'w').close()
        self.create_login_table()
        self.create_mail_camp_table()


    def create_mail_camp_table(self):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute(CREATEMAILCAMPDB)
            conn.commit()


    def insert_mail_camp(self, response, subject):
        if not self.is_valid_input(subject):
            return 
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            for email, status in response.items():
                if not(self.is_valid_input(email, str(status))):
                    continue
                cursor.execute(INSERTEMAILCAMP ,(email, status, subject, datetime.now()))
                

    def get_campaigns(self, lastDays=None, lastHours=None):
        last = datetime.now()
        if isinstance(lastDays, int):
            last -= timedelta(days=lastDays)
        if isinstance(lastHours, int):
            last -= timedelta(hours=lastHours)
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute(GETCAMP, (last,))
            return cursor.fetchall()



        
