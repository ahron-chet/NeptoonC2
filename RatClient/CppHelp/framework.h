#pragma once

#define WIN32_LEAN_AND_MEAN             // Exclude rarely-used stuff from Windows headers
// Windows Header Files
#include <windows.h>
#include <Sddl.h>
#include <UserEnv.h>
#include <iostream>
#include <vector>
#include <tchar.h>
#include <WtsApi32.h>
#include <TlHelp32.h>
#include <DbgHelp.h>
#include <wlanapi.h>
#include <unordered_map>
#include <sstream>
#pragma comment(lib, "DbgHelp.lib")
#pragma comment(lib, "ntdll.lib")
#pragma comment(lib, "wlanapi.lib")
#define INTERFACE_NAME ":7098753bf5e79cf50663c63d44df05a2:"
#define PROFILE_INFO ":c7c73551973e970c26beb4f1f8a70e07:"


