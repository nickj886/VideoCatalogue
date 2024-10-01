namespace VideoCatalogue.Helpers
{
    public static class DirectoryInfoExtensions
    {
        public static long SizeBytes(this DirectoryInfo dir)
        {
            return dir.GetFiles().Sum(fi => fi.Length) +
                   dir.GetDirectories().Sum(di => dir.SizeBytes());
        }

        public static long ToMegaBytes(this long bytes)
        {
            return bytes / 1024 / 1024;
        }
    }
}
