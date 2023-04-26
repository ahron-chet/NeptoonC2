using System.Security.Cryptography;

namespace RatClient.SymetricCrypto
{
    class AESCyrpto
    {
        AesManaged aesManaged;
        private byte[] key;
        private byte[] iv;
        private ICryptoTransform encryptor;
        private ICryptoTransform decryptor;

        public AESCyrpto(byte[] key, byte[] iv)
        {
            this.key = key;
            this.iv = iv;
            this.aesManaged = new AesManaged();
            this.aesManaged.Key = key;
            this.aesManaged.IV = iv;
            this.aesManaged.Mode = CipherMode.CBC;
            this.aesManaged.Padding = PaddingMode.PKCS7;
            this.encryptor = this.aesManaged.CreateEncryptor();
            this.decryptor = this.aesManaged.CreateDecryptor();
        }

        public static byte[] randomIV(byte[] oldIV)
        {
            return AcRSA.RSA.Gethash("md5", oldIV);
        }
        public byte[] Encrypt(byte[] data)
        {
            this.aesManaged.IV = randomIV(this.aesManaged.IV);
            return this.encryptor.TransformFinalBlock(data, 0, data.Length);
        }
        public byte[] Decrypt(byte[] data)
        {
            this.aesManaged.IV = randomIV(this.aesManaged.IV);
            return this.decryptor.TransformFinalBlock(data, 0, data.Length);
        }
        public byte[] RandomKey()
        {
            return MathAc.RamdomBytes(32);
        }
    }
}
