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
            if (key != null && iv != null ) 
            {
                this.aesManaged = new AesManaged();
                this.aesManaged.Key = key;
                this.aesManaged.IV = iv;
                this.aesManaged.Mode = CipherMode.CBC;
                this.aesManaged.Padding = PaddingMode.PKCS7;
                this.encryptor = null;
                this.decryptor = null;
            }
        }

        public byte[] randomIV(byte[] oldIV)
        {
            return AcRSA.ACRSA.Gethash("md5", oldIV);
        }
        public byte[] Encrypt(byte[] data)
        {
            this.iv = randomIV(this.iv); 
            this.aesManaged.IV = this.iv;
            this.encryptor = this.aesManaged.CreateEncryptor(); 
            return this.encryptor.TransformFinalBlock(data, 0, data.Length);
        }

        public byte[] Decrypt(byte[] data)
        {
            this.iv = randomIV(this.iv); 
            this.aesManaged.IV = this.iv;
            this.decryptor = this.aesManaged.CreateDecryptor(); 
            return this.decryptor.TransformFinalBlock(data, 0, data.Length);
        }

        public byte[] RandomKey()
        {
            return MathAc.RamdomBytes(32);
        }
    }
}
