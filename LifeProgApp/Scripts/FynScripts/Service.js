app.service("LifeProgAppService", function ($http) {
    this.saveAccount = function (userData) {
        return $http({
            method: "post",
            url: "/Account/Create",
            data: userData
        });
    };

    this.jsonService = function (userData) {
        var response = $http({
            method: "post",
            url: "/Def/UpdateData",
            data: userData
        });
        return response;
    };

    this.getDataService = function () {
        return $http({
            method: "GET",
            url: "/Def/GetData"
        });
    };

    //archive data service
    this.archiveDataService = function (regID) {
        var response = $http({
            method: "post",
            url: "/Def/ArchiveData",
            data: { registrationID: regID }
        });
        return response;
    };

    //new serviceto get archived data
    //this.getDataService = function (archive) {
    //    var response = $http({
    //        method: "post",
    //        url: "/Def/GetArchivedData",
    //        params: {
    //            archivedID: archive
    //        }
    //    });
    //};

    // Add this function to your Service.js file
    this.updateUserService = function (userData) {
        var response = $http({
            method: "post",
            url: "/Def/UpdateUser",
            data: userData
        });
        return response;
    };

    this.uploadFile = function (file) {
        var formData = new FormData();
        formData.append('file', file);
        var response = $http({
            method: "POST",
            url: "/Def/Upload",
            data: formData,
            headers: {
                'Content-Type': undefined
            },
            transformRequest: angular.identity
        });
        return response;
    };


    // option for Carousel Images
    this.getCarouselImagesService = function () {
        return $http({
            method: "GET",
            url: "/Def/GetCarouselImagesFunc"
        });
    }

});