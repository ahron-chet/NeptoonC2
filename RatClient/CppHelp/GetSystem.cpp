#include "pch.h"

bool isSystem(DWORD processID)
{
	bool isSystem = false;
	HANDLE hProcess = OpenProcess(PROCESS_QUERY_INFORMATION, FALSE, processID);
	if (hProcess)
	{
		HANDLE hToken;
		if (OpenProcessToken(hProcess, TOKEN_QUERY, &hToken))
		{
			DWORD tokenInfoSize = 0;
			GetTokenInformation(hToken, TokenUser, NULL, 0, &tokenInfoSize);
			PTOKEN_USER pTokenUser = (PTOKEN_USER)LocalAlloc(LPTR, tokenInfoSize);

			if (GetTokenInformation(hToken, TokenUser, pTokenUser, tokenInfoSize, &tokenInfoSize))
			{

				LPTSTR stringSid = nullptr;

				if (ConvertSidToStringSid(pTokenUser->User.Sid, &stringSid)) {
					isSystem = _tcsicmp(stringSid, L"S-1-5-18") == 0;
				}
			}
			LocalFree(pTokenUser);
			CloseHandle(hToken);
		}
		CloseHandle(hProcess);
	}
	return isSystem;
}


extern "C" _declspec(dllexport)
DWORD GetSystemPID()
{
	DWORD systemPID = 0;
	HANDLE hSnapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);

	if (hSnapshot != INVALID_HANDLE_VALUE)
	{
		PROCESSENTRY32 pe32;
		pe32.dwSize = sizeof(PROCESSENTRY32);

		if (Process32First(hSnapshot, &pe32))
		{
			while (Process32Next(hSnapshot, &pe32))
			{
				systemPID = pe32.th32ProcessID;
				if (isSystem(systemPID) && systemPID != 4) {
					break;
				}
			}
		}
		CloseHandle(hSnapshot);
	}
	return systemPID;
}

void EnableSeDebugPrivilegePrivilege()
{
	LUID luid;
	HANDLE currentProc = OpenProcess(PROCESS_ALL_ACCESS, false, GetCurrentProcessId());

	if (currentProc)
	{
		HANDLE TokenHandle(NULL);
		BOOL hProcessToken = OpenProcessToken(currentProc, TOKEN_ADJUST_PRIVILEGES | TOKEN_QUERY, &TokenHandle);
		if (hProcessToken)
		{
			BOOL checkToken = LookupPrivilegeValue(NULL, L"SeDebugPrivilege", &luid);

			if (!checkToken)
			{
				std::cerr << "The existing process token already contains the SeDebugPrivilege." << std::endl;
			}
			else
			{
				TOKEN_PRIVILEGES tokenPrivs;

				tokenPrivs.PrivilegeCount = 1;
				tokenPrivs.Privileges[0].Luid = luid;
				tokenPrivs.Privileges[0].Attributes = SE_PRIVILEGE_ENABLED;

				BOOL adjustToken = AdjustTokenPrivileges(TokenHandle, FALSE, &tokenPrivs, sizeof(TOKEN_PRIVILEGES), (PTOKEN_PRIVILEGES)NULL, (PDWORD)NULL);

				if (adjustToken != 0)
				{
					std::cerr << "The SeDebugPrivilege has been appended to the current process token." << std::endl;
				}
			}
			CloseHandle(TokenHandle);
		}
	}
	CloseHandle(currentProc);
}

extern "C" _declspec(dllexport)
int SpawnSystem(int parentId, const wchar_t* appName, wchar_t* argument) {

	EnableSeDebugPrivilegePrivilege();
	PROCESS_INFORMATION processInfo;
	STARTUPINFOEXW startupInfoEx;
	SIZE_T attributeListSize;

	ZeroMemory(&processInfo, sizeof(processInfo));
	ZeroMemory(&startupInfoEx, sizeof(startupInfoEx));
	startupInfoEx.StartupInfo.cb = sizeof(startupInfoEx);

	InitializeProcThreadAttributeList(nullptr, 1, 0, &attributeListSize);
	startupInfoEx.lpAttributeList = reinterpret_cast<LPPROC_THREAD_ATTRIBUTE_LIST>(HeapAlloc(GetProcessHeap(), 0, attributeListSize));
	InitializeProcThreadAttributeList(startupInfoEx.lpAttributeList, 1, 0, &attributeListSize);

	HANDLE parentHandle = OpenProcess(PROCESS_CREATE_PROCESS | PROCESS_DUP_HANDLE, FALSE, parentId);
	if (parentHandle == nullptr) {
		std::cerr << "Failed to open parent process with error code: " << GetLastError() << std::endl;
		return 1;
	}

	UpdateProcThreadAttribute(startupInfoEx.lpAttributeList, 0, PROC_THREAD_ATTRIBUTE_PARENT_PROCESS, &parentHandle, sizeof(parentHandle), nullptr, nullptr);

	SECURITY_ATTRIBUTES processSec;
	SECURITY_ATTRIBUTES threadSec;
	processSec.nLength = sizeof(processSec);
	processSec.lpSecurityDescriptor = nullptr;
	processSec.bInheritHandle = TRUE;
	threadSec.nLength = sizeof(threadSec);
	threadSec.lpSecurityDescriptor = nullptr;
	threadSec.bInheritHandle = TRUE;

	if (!CreateProcessW(appName, argument, &processSec, &threadSec, TRUE, EXTENDED_STARTUPINFO_PRESENT | CREATE_NEW_CONSOLE, nullptr, nullptr, reinterpret_cast<LPSTARTUPINFOW>(&startupInfoEx), &processInfo)) {
		std::cerr << "Failed to spawn process with error code: " << GetLastError() << std::endl;
		return 1;
	}


	CloseHandle(processInfo.hProcess);
	CloseHandle(processInfo.hThread);
	CloseHandle(parentHandle);
	HeapFree(GetProcessHeap(), 0, startupInfoEx.lpAttributeList);

	return 0;
}