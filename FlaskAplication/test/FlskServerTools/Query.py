
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

CREATEMAILCAMPDB = """
CREATE TABLE IF NOT EXISTS ActiveCampaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    status BOOLEAN NOT NULL,
    subject TEXT NOT NULL,
    date TEXT NOT NULL
);
"""

INSERTEMAILCAMP = """
INSERT INTO ActiveCampaigns (email, status, subject, date)
VALUES (?, ?, ?, ?)
"""

GETCAMP = """
SELECT * FROM ActiveCampaigns 
WHERE date >= ?
"""