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
            url: "/Main/UpdateData",
            data: userData
        });
        return response;
    }; 

    this.getDataService = function () {
        return $http("/Main/GetData");
    }



    //archive data service

    this.archiveDataService = function (regID) {
        var response = $http({
            method: "post",
            url: "/Main/ArchiveData",
            data: { registrationID: regID }
        });

        return response;
    }

    //new serviceto get archived data
    //this.getDataService = function (archive) {
    //    var response = $http({
    //        method: "post",
    //        url: "/Main/GetArchivedData",
    //        params: {
    //            archivedID: archive
    //        }
    //    });


    // Add this function to your Service.js file

    this.updateUserService = function (userData) {
        var response = $http({
            method: "post",
            url: "/Def/UpdateUser",
            data: userData
        });
        return response;
    };

}); 