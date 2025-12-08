// ============================================================================
// LifeProgApp Service
// ============================================================================
app.service("LifeProgAppService", function ($http) {

    // ========================================================================
    // ACCOUNT & REGISTRATION SERVICES
    // ========================================================================

    this.saveAccount = function (userData) {
        return $http({
            method: "post",
            url: "/Def/Create",
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

    // ========================================================================
    // DATA RETRIEVAL SERVICES
    // ========================================================================

    this.getDataService = function () {
        return $http.get("/Def/GetData");

    };

    // ========================================================================
    // ARCHIVE SERVICES
    // ========================================================================

    this.archiveDataService = function (regID) {
        var response = $http({
            method: "post",
            url: "/Def/ArchiveData",
            data: { registrationID: regID }
        });
        return response;
    };

    // ========================================================================
    // UPDATE SERVICES
    // ========================================================================

    this.updateUserService = function (userData) {
        var response = $http({
            method: "post",
            url: "/Def/UpdateUser",
            data: userData
        });
        return response;
    };

    // ========================================================================
    // FILE UPLOAD SERVICES
    // ========================================================================

    this.uploadFile = function (file) {
        var fd = new FormData();
        fd.append('file', file);

        return $http({
            method: "post",
            url: "/Def/Upload",
            data: fd,
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        });
    };

    // ========================================================================
    // NEW: QUEST PHOTO UPLOAD SERVICE
    // ========================================================================
    this.uploadQuestPhoto = function (file, questId) {
        var fd = new FormData();
        fd.append('file', file);

        return $http({
            method: "post",
            url: "/Def/UploadQuestPhoto",
            params: { questId: questId },
            data: fd,
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        });
    };

    // ========================================================================
    // NEW: GET QUEST PHOTOS SERVICE
    // ========================================================================
    this.getQuestPhotos = function (questId) {
        return $http({
            method: "get",
            url: "/Def/GetQuestPhotos",
            params: { questId: questId }
        });
    };

    // ========================================================================
    // NEW: GET ALL QUEST PHOTOS SERVICE
    // ========================================================================
    this.getAllQuestPhotos = function (userId) {
        userId = userId || 1;
        return $http({
            method: "get",
            url: "/Def/GetAllQuestPhotos",
            params: { userId: userId }
        });
    };

    // ========================================================================
    // CAROUSEL/GALLERY SERVICES
    // ========================================================================

    this.getCarouselImagesService = function () {
        return $http({
            method: "get",
            url: "/Def/GetCarouselImagesFunc"
        });
    };

    // ========================================================================
    // DASHBOARD SERVICES (One % Database Integration)
    // ========================================================================

    // Dashboard Data Service
    this.getDashboardData = function (userId) {
        userId = userId || 1;
        return $http({
            method: "get",
            url: "/Def/GetDashboardData",
            params: { userId: userId }
        });
    };

    // Get User Goals Service
    this.getUserGoals = function (userId) {
        userId = userId || 1;
        return $http({
            method: "get",
            url: "/Def/GetUserGoals",
            params: { userId: userId }
        });
    };

    // Get Today's Quests Service
    this.getTodaysQuests = function (userId) {
        userId = userId || 1;
        return $http({
            method: "get",
            url: "/Def/GetTodaysQuests",
            params: { userId: userId }
        });
    };

    // Complete Quest Service
    this.completeQuest = function (questId, userId) {
        userId = userId || 1;
        return $http({
            method: "post",
            url: "/Def/CompleteQuest",
            data: { questId: questId, userId: userId }
        });
    };

    // Update Goal Progress Service
    this.updateGoalProgress = function (goalId, newValue) {
        return $http({
            method: "post",
            url: "/Def/UpdateGoalProgress",
            data: { goalId: goalId, newValue: newValue }
        });
    };

    // Get Goal Categories Service
    this.getGoalCategories = function () {
        return $http({
            method: "get",
            url: "/Def/GetGoalCategories"
        });
    };

});

app.filter("mvcDate", function () {
    return function (value) {
        if (!value) return "";
        // 1. Strip out the /Date( and )/ characters
        // 2. Parse the numbers into a real JavaScript Date object
        return new Date(parseInt(value.substr(6)));
    };
});