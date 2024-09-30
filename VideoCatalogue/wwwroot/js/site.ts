class VideoUploader {
    public static getCatalogue() {
        let request = new XMLHttpRequest();
        request.open("GET", "/video/catalogue", false);
        request.onload = (ev) => {
            let targetRequest = ev.currentTarget as XMLHttpRequest;
            if (targetRequest.status === 200) {
                this.populateCatalogueTable(targetRequest.responseText);
            }
            else if (request.responseText) {
                this.showError(request.responseText);
            }
            else {
                this.showError("An issue occurred getting the catalogue.");
            }
        };
        request.onerror = (ev) => {
            this.showError(request.responseText);
        };
        this.hideError();
        request.send();
    }

    public static hideElement(id: string) {
        let element = document.getElementById(id);
        if (element) {
            element.style.display = "none";
            element.style.visibility = "collapse";
        }
    }

    public static hideError() {
        let errorMessage = document.getElementById("error-message") as HTMLDivElement;
        if (errorMessage)
            errorMessage.innerText = null;
        this.hideElement("error-div");
    }

    public static hideCataLogue() {
        let videoPlayer = document.getElementById("videoPlayer") as HTMLVideoElement;
        if (videoPlayer) {
            videoPlayer.pause();
            videoPlayer.src = null;
        }
        this.hideElement("catalogue-div");
    }

    private static populateCatalogueTable(dataText: string) {
        this.showCatalogue();
        let catalogueTable = document.getElementById("catalogue-table") as HTMLTableElement;
        if (catalogueTable) {
            let body = catalogueTable.tBodies[0];
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
        let data = JSON.parse(dataText) as any[];
        if (data.length > 0) {
            if (catalogueTable) {
                let body = catalogueTable.tBodies[0];
                if (body) {
                    for (var i = 0; i < data.length; i++) {
                        let row = catalogueTable.insertRow();

                        let anchorLink = document.createElement("a");
                        anchorLink.textContent = data[i].Name;
                        anchorLink.href = `javascript:VideoUploader.showVideo('${data[i].Name}');`;

                        let nameCell = row.insertCell();
                        nameCell.appendChild(anchorLink);
                        row.appendChild(nameCell);

                        let sizeCell = row.insertCell();
                        sizeCell.className = "size-column";
                        sizeCell.textContent = data[i].Size;
                        row.appendChild(sizeCell);

                        body.appendChild(row);
                    }
                }
            }
        }
        else {
            this.showNoCatalogue();
        }
    }

    public static showElement(id: string) {
        let element = document.getElementById(id);
        if (element) {
            element.style.display = "block";
            element.style.visibility = "visible";
        }
    }

    public static showCatalogue() {
        this.hideElement("no-catalogue-div");
        this.hideElement("uploader-div");
        this.showElement("catalogue-div");
    }

    public static showError(error: string) {
        this.showElement("error-div");
        let errorMessage = document.getElementById("error-message") as HTMLDivElement;
        if (errorMessage)
            errorMessage.innerText = error;
    }

    public static showNoCatalogue() {
        this.hideCataLogue();
        this.hideElement("uploader-div");
        this.showElement("no-catalogue-div");
    }

    public static showUploader() {
        this.hideCataLogue();
        this.hideElement("no-catalogue-div");
        this.showElement("uploader-div");
    }

    public static showVideo(fileName: string) {
        this.hideError();
        let videoPlayer = document.getElementById("videoPlayer") as HTMLVideoElement;
        if (videoPlayer) {
            videoPlayer.autoplay = true;
            videoPlayer.src = `/video/${fileName}`;
        }
    }

    public static uploadVideos() {
        try {
            let uploadForm = document.getElementById("uploadForm") as HTMLFormElement;
            if (uploadForm) {
                let data = JSON.stringify(uploadForm);
                let request = new XMLHttpRequest();
                request.open("POST", "/video/upload", false);
                request.onload = (ev) => {
                    let x = ev.currentTarget as XMLHttpRequest;
                    if (x.status === 200) {
                        this.getCatalogue();
                    }
                    else if (request.responseText) {
                        this.showError(request.responseText);
                    }
                    else {
                        this.showError("An issue occurred uploading the video(s).");
                    }
                };
                request.onerror = (ev) => {
                    this.showError(request.responseText);
                };
                this.hideError();
                request.send(new FormData(uploadForm));
            }
        }
        catch (error) {
            this.showError(error);
        }
    }
}