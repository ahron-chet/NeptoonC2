using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;

namespace RatClient.Mtool.FileExp
{
	public class FileObj
	{
		public string name { get; set; }
		public string icon { get; private set; }
		public long size { get; private set; }
		public string lastTimeUpdate { get; private set; }
		public string creationTime { get; private set; }
		public string path;

		public FileObj(string path)
		{
			this.path = path;
			InitializeFileProperties();
		}

		private void SetFileIcon()
		{
			try
			{
				Icon iconi = Icon.ExtractAssociatedIcon(this.path);
				using (MemoryStream ms = new MemoryStream())
				{
					iconi.ToBitmap().Save(ms, System.Drawing.Imaging.ImageFormat.Png);
					this.icon = Convert.ToBase64String(ms.ToArray());
				}
			}
			catch (Exception ex)
			{
				this.icon = "Default";
				Console.WriteLine(ex);
			}
		}

		private void InitializeFileProperties()
		{
			var baseInfo = new FileInfo(this.path);
			SetFileIcon();
			this.creationTime = baseInfo.CreationTimeUtc.ToString();
			this.size = baseInfo.Length;
			this.lastTimeUpdate = baseInfo.LastWriteTimeUtc.ToString();
			this.name = baseInfo.Name;
		}
	}

	public class Directories
	{
		public string[] DirectoriesArr { get; set; }

		public Directories(string path)
		{
			this.DirectoriesArr = Directory.GetDirectories(path);
		}
	}

	public class ExplorerObj
	{
		public FileObj[] Files { get; set; }
		public Directories Folders { get; set; }
		public string MainPath { get; set; }

		public ExplorerObj(FileObj[] files, Directories folders, string MainPath)
		{
			this.Files = files;
			this.Folders = folders;
			this.MainPath = MainPath;
		}
	}

	public class EXP
	{
		public static string GetValidExeAndDir(string path)
		{
			var directories = new Directories(path);
			var files = new List<FileObj>();

			foreach (string i in Directory.GetFiles(path, "*.exe"))
			{
				if (!Tools.Isx64Exe(i)) continue;
				var fileObj = new FileObj(i);
				files.Add(fileObj);
			}

			string result = System.Text.Json.JsonSerializer.Serialize(
				new ExplorerObj(files.ToArray(), directories, path));
			return result;
		}
	}
}
