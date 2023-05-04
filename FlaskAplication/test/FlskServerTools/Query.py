
LOGINDB = '''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
)
'''

INSERTUSER = "INSERT INTO users (username, password) VALUES (?, ?)"

AUTHENTICATE ="SELECT * FROM users WHERE username = ? AND password = ?"

USEREXISTS = "SELECT COUNT(*) FROM users WHERE username=?"