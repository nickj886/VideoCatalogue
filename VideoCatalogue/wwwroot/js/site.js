var VideoUploader = /** @class */ (function () {
    function VideoUploader() {
    }
    VideoUploader.getCatalogue = function () {
        var _this = this;
        var request = new XMLHttpRequest();
        request.open("GET", "/video/catalogue", false);
        request.onload = function (ev) {
            var targetRequest = ev.currentTarget;
            if (targetRequest.status === 200) {
                _this.populateCatalogueTable(targetRequest.responseText);
            }
            else if (request.responseText) {
                _this.showError(request.responseText);
            }
            else {
                _this.showError("An issue occurred getting the catalogue.");
            }
        };
        request.onerror = function (ev) {
            _this.showError(request.responseText);
        };
        this.hideError();
        request.send();
    };
    VideoUploader.hideElement = function (id) {
        var element = document.getElementById(id);
        if (element) {
            element.style.display = "none";
            element.style.visibility = "collapse";
        }
    };
    VideoUploader.hideError = function () {
        var errorMessage = document.getElementById("error-message");
        if (errorMessage)
            errorMessage.innerText = null;
        this.hideElement("error-div");
    };
    VideoUploader.hideCataLogue = function () {
        var videoPlayer = document.getElementById("videoPlayer");
        if (videoPlayer) {
            videoPlayer.pause();
            videoPlayer.src = null;
        }
        this.hideElement("catalogue-div");
    };
    VideoUploader.populateCatalogueTable = function (dataText) {
        this.showCatalogue();
        var catalogueTable = document.getElementById("catalogue-table");
        if (catalogueTable) {
            var body = catalogueTable.tBodies[0];
            if (body) {
                if (body.rows) {
                    while (body.rows && body.rows.length > 0) {
                        try {
                            var row = body.rows[0];
                            if (row)
                                body.removeChild(row);
                        }
                        catch (error) {
                            console.log(error);
                        }
                    }
                }
            }
        }
        var data = JSON.parse(dataText);
        if (data.length > 0) {
            if (catalogueTable) {
                var body = catalogueTable.tBodies[0];
                if (body) {
                    for (var i = 0; i < data.length; i++) {
                        var row_1 = catalogueTable.insertRow();
                        var anchorLink = document.createElement("a");
                        anchorLink.textContent = data[i].Name;
                        anchorLink.href = "javascript:VideoUploader.showVideo('".concat(data[i].Name, "');");
                        var nameCell = row_1.insertCell();
                        nameCell.appendChild(anchorLink);
                        row_1.appendChild(nameCell);
                        var sizeCell = row_1.insertCell();
                        sizeCell.className = "size-column";
                        sizeCell.textContent = data[i].Size;
                        row_1.appendChild(sizeCell);
                        body.appendChild(row_1);
                    }
                }
            }
        }
        else {
            this.showNoCatalogue();
        }
    };
    VideoUploader.showElement = function (id) {
        var element = document.getElementById(id);
        if (element) {
            element.style.display = "block";
            element.style.visibility = "visible";
        }
    };
    VideoUploader.showCatalogue = function () {
        this.hideElement("no-catalogue-div");
        this.hideElement("uploader-div");
        this.showElement("catalogue-div");
    };
    VideoUploader.showError = function (error) {
        this.showElement("error-div");
        var errorMessage = document.getElementById("error-message");
        if (errorMessage)
            errorMessage.innerText = error;
    };
    VideoUploader.showNoCatalogue = function () {
        this.hideCataLogue();
        this.hideElement("uploader-div");
        this.showElement("no-catalogue-div");
    };
    VideoUploader.showUploader = function () {
        this.hideCataLogue();
        this.hideElement("no-catalogue-div");
        this.showElement("uploader-div");
    };
    VideoUploader.showVideo = function (fileName) {
        this.hideError();
        var videoPlayer = document.getElementById("videoPlayer");
        if (videoPlayer) {
            videoPlayer.autoplay = true;
            videoPlayer.src = "/video/".concat(fileName);
        }
    };
    VideoUploader.uploadVideos = function () {
        var _this = this;
        try {
            var uploadForm = document.getElementById("uploadForm");
            if (uploadForm) {
                var data = JSON.stringify(uploadForm);
                var request_1 = new XMLHttpRequest();
                request_1.open("POST", "/video/upload", false);
                request_1.onload = function (ev) {
                    var x = ev.currentTarget;
                    if (x.status === 200) {
                        _this.getCatalogue();
                    }
                    else if (request_1.responseText) {
                        _this.showError(request_1.responseText);
                    }
                    else {
                        _this.showError("An issue occurred uploading the video(s).");
                    }
                };
                request_1.onerror = function (ev) {
                    _this.showError(request_1.responseText);
                };
                this.hideError();
                request_1.send(new FormData(uploadForm));
            }
        }
        catch (error) {
            this.showError(error);
        }
    };
    return VideoUploader;
}());
//# sourceMappingURL=site.js.map