using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using VideoCatalogue.Helpers;
using VideoCatalogue.Models;

namespace VideoCatalogue.Controllers
{
    [ApiController]
    [Route("video")]
    public class VideoController : ControllerBase
    {
        private readonly AppSettings _appSettings;

        public VideoController(IOptions<AppSettings> appSettingsOptions)
        {
            _appSettings = appSettingsOptions.Value;
        }

        [HttpGet("catalogue")]
        public ActionResult Catalogue()
        {
            try
            {
                var directoryInfo = new DirectoryInfo(_appSettings.MediaFolder);
                if (!directoryInfo.Exists)
                    throw new Exception($"Directory {_appSettings.MediaFolder} does not exist");

                var content = System.Text.Json.JsonSerializer.Serialize(directoryInfo.GetFiles().Select(o => new
                {
                    o.Name,
                    Size = SizeFormatter(o.Length)
                }));

                return Content(content);
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult("There was a problem getting the catalogue");
            }
        }

        [HttpGet("{filename}")]
        public ActionResult Get(string filename)
        {
            try
            {
                var fileInfo = new FileInfo(Path.Combine(_appSettings.MediaFolder, filename));
                if (!fileInfo.Exists)
                    throw new Exception($"File {filename} does not exist");

                return new FileStreamResult(fileInfo.OpenRead(), "video/mp4");
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(ex.Message);
            }
        }

        [HttpPost("upload")]
        [RequestSizeLimit(UploadHelpers.MaxFileUploadSize)]
        public ActionResult Upload()
        {
            try
            {
                if (!HttpContext.Request.Form.Files.Any())
                    return new NoContentResult();

                var mediaFolderDirectory = Directory.CreateDirectory(_appSettings.MediaFolder);

                foreach (var file in HttpContext.Request.Form.Files)
                {
                    if (file == null)
                        continue;

                    var fileInfo = new FileInfo(Path.Combine(mediaFolderDirectory.FullName, file.FileName));

                    using (var fileInfoStream = fileInfo.Exists ? fileInfo.OpenWrite() : fileInfo.Create())
                        file.OpenReadStream().CopyTo(fileInfoStream);
                }

                return new OkResult();
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(ex.Message);
            }
        }

        private string SizeFormatter(long input)
        {
            switch (input.ToString().Length)
            {
                case > 12:
                    return input / 1000000000000 + " Tb";

                case > 9:
                    return input / 1000000000 + " Gb";

                case > 6:
                    return input / 1000000 + " Mb";

                case > 3:
                    return input / 1000 + " Kb";

                default:
                    return input + " b";
            }
        }
    }
}
