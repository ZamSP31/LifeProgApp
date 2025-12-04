app.controller("LifeProgAppController", ['$scope', '$window', function ($scope, $window) {


    $scope.redirectToLogin = function () {
        $window.location.href = '/Def/LoginPage';
    }

    $scope.redirectToRegistration = function () {
        $window.location.href = '/Def/RegistrationPage';
    }

    $scope.redirectToDashboard = function () {
        $window.location.href = '/Def/DashboardPage';
    }

    $scope.redirectToGoals = function () {
        $window.location.href = '/Def/GoalsPage';
    }

    $scope.redirectToProgress = function () {
        $window.location.href = '/Def/ProgressPage';
    }
    
    $scope.showSuccess = false;

    $scope.registeredUsers = [];


    
    app.controller("RegistrationController", ['$scope', '$window', 'LifeProgAppService', function ($scope, $window, LifeProgAppService) {

        $scope.showSuccess = false;

        // new code for archiving process
        $scope.isArchived = 0;
        $scope.registeredUsers = [];





        // --- Save Function ---
        $scope.saveRegistration = function () {

            // 1. Validation
            if (!$scope.firstName || !$scope.lastName || !$scope.email) {
                alert("Please fill in First Name, Last Name and Email.");
                return;
            }

            if ($scope.password || $scope.confirmPassword) {
                if ($scope.password !== $scope.confirmPassword) {
                    alert("Passwords do not match.");
                    return;
                }
            }

            // 2. Create Data Object
            var userData = {
                "FirstName": $scope.firstName,
                "LastName": $scope.lastName,
                "Gender": $scope.gender || "",
                "Email": $scope.email,
                "Password": $scope.password || ""
            };

            // 3. Call the Service
            // Because we injected LifeProgAppService at the top, this now works!
            var saveData = LifeProgAppService.saveAccount(userData);

            saveData.then(function (response) {
                if (response && response.data && response.data.success) {

                    if (response.data.message) {
                        alert(response.data.message);
                    } else {
                        alert("Registration successful.");
                    }

                    $scope.registeredUsers.push(angular.copy(userData));

                    // Reset the form
                    $scope.cancelData();
                    $scope.showSuccess = true;

                } else {
                    alert((response && response.data && response.data.message) || "Registration failed.");
                }
            }, function (error) {
                console.error("Save error:", error);
                alert("An error occurred while saving the registration.");
            });
        };

        // --- Cancel / Reset Function ---
        $scope.cancelData = function () {
            $scope.firstName = null;
            $scope.lastName = null;
            $scope.gender = null;
            $scope.email = null;
            $scope.password = null;
            $scope.confirmPassword = null;
            $scope.showSuccess = false;
        };


        // GetDataService
        $scope.getDataFunc = function () {
            var getData = LifeProgAppService.getDataService();
            getData.then(function (returnedData) {
                $scope.tableValue = returnedData.data;

            }

            };


        // GetDataService.2
        // NOTE (getDataFunc) will need to be called somewhere in the HTML to function
            //    $scope.getDataFunc = function () {
            //if (isArchived == 0) {
            //    $scope.isArchived = 1;
            //} else {
            //    $scope.isArchived = 0;
            //}
            //var getData = LifeProgAppService.getDataService($scope.isArchived);
            //getData.then(function (returnedData) {
            //    $scope.tableValue = returnedData.data;

            //}

            //};

    }]);


//archiving data service
    $scope.archiveData = function () {
        var getData = LifeProgAppService.archiveDataService(regID);
        archiveData.then(function (returnedData) {
                $scope.tableValue = returnedData.data;

      });

    };


    //

    
//    $scope.saveRegistration = function () {


//        if (!$scope.firstName || !$scope.lastName || !$scope.email) {
//            alert("Please fill in First Name, Last Name and Email.");
//            return;
//        }

//        if ($scope.password || $scope.confirmPassword) {
//            if ($scope.password !== $scope.confirmPassword) {
//                alert("Passwords do not match.");
//                return;
//            }
//        }


//        var userData = {
//            "FirstName": $scope.firstName,
//            "LastName": $scope.lastName,

//            "Gender": $scope.gender || "",

//            "Email": $scope.email,


//            "Password": $scope.password || ""
//        };


//        var saveData = LifeProgAppService.saveAccount(userData);

//        saveData.then(function (response) {
//            if (response && response.data && response.data.success) {


//                if (response.data.message) {
//                    alert(response.data.message);
//                } else {
//                    alert("Registration successful.");
//                }


//                $scope.registeredUsers.push(angular.copy(userData));


//                $scope.cancelData();


//                $scope.showSuccess = true;
//            } else {
//                alert((response && response.data && response.data.message) || "Registration failed.");
//            }
//        }, function (error) {
//            console.error("Save error:", error);
//            alert("An error occurred while saving the registration.");
//        });
//    };


//    $scope.cancelData = function () {
//        $scope.firstName = null;
//        $scope.lastName = null;

//        $scope.gender = null;

//        $scope.email = null;




//        $scope.password = null;
//        $scope.confirmPassword = null;

//        $scope.showSuccess = false;


//    };
//});

