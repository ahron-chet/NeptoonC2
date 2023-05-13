from Tools.toolsF import *
import json



class CommandManager(object):

    def __init__(self,writer, reader):
        self.writer = writer
        self.reader = reader
        self.waitingForResult = False
     
    def retriveCommand(self, message:dict) -> str:
        command = message.get("command")
        self.waitingForResult = command is not None 
        if not self.waitingForResult: 
            return
        if command == "5df297c2f2da83a8b45cfd012fbf9b3c":
            command = gen_xml("root", command=command, type=message.get("type"),web=message.get("web")) 
            self.writer(command.encode())
            return collect(json.loads(self.reader().decode(errors='replace')))
        command = gen_xml("root", command=command)
        self.writer(command.encode())
        return self.reader().decode(errors='replace')
       
    def isValid(self,*args) -> bool:
        for i in args:
            if i == None:
                return False
        return True
    
    
        
    
    
        

            
