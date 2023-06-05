
class AuthorizationManage(object):

    def __init__(self):
        self.tokens = []

    def token_valid(self, token):
        return token in self.tokens
    
    def insert_token(self, token):
        self.tokens.append(token)

    