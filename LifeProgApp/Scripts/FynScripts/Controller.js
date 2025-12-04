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
            });

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



    // Add these functions to your RegistrationController in Controller.js

    // SweetAlert function


    $scope.showSweetAlert = function () {
        Swal.fire({
            title: 'Welcome!',
            text: 'This is a SweetAlert2 popup with Materialize styling',
            icon: 'success',
            confirmButtonText: 'Cool!',
            confirmButtonColor: '#1976d2',
            showCancelButton: true,
            cancelButtonText: 'Close'
        });
    };

    // SELECT Button Function
    $scope.selectUser = function (user) {
        Swal.fire({
            title: 'User Selected',
            html: `
            <div style="text-align: left;">
                <p><strong>ID:</strong> ${user.registrationID}</p>
                <p><strong>First Name:</strong> ${user.firstName}</p>
                <p><strong>Last Name:</strong> ${user.lastName}</p>
                <p><strong>Created:</strong> ${new Date(user.createdAt).toLocaleDateString()}</p>
                <p><strong>Updated:</strong> ${new Date(user.updatedAt).toLocaleDateString()}</p>
                <p><strong>Status:</strong> ${user.isArchived == 0 ? 'Active' : 'Archived'}</p>
            </div>
        `,
            icon: 'info',
            confirmButtonText: 'OK',
            confirmButtonColor: '#1976d2'
        });

        console.log('Selected User:', user);
    };

    // UPDATE Button Function
    $scope.updateUser = function (user) {
        // Store selected user in scope
        $scope.selectedUser = angular.copy(user);

        // Open Materialize modal
        var elem = document.getElementById('updateModal');
        var instance = M.Modal.getInstance(elem);
        instance.open();
    };

    // SAVE UPDATE Function (called from modal)
    $scope.saveUpdate = function () {
        if (!$scope.selectedUser.firstName || !$scope.selectedUser.lastName) {
            Swal.fire({
                title: 'Error!',
                text: 'First Name and Last Name are required',
                icon: 'error',
                confirmButtonColor: '#f44336'
            });
            return;
        }

        // Prepare data for update
        var updateData = {
            registrationID: $scope.selectedUser.registrationID,
            firstName: $scope.selectedUser.firstName,
            lastName: $scope.selectedUser.lastName
        };

        // Call service to update (you'll need to create this in Service.js)
        var updatePromise = LifeProgAppService.updateUserService(updateData);

        updatePromise.then(function (response) {
            if (response && response.data && response.data.success) {
                Swal.fire({
                    title: 'Updated!',
                    text: 'User has been updated successfully',
                    icon: 'success',
                    confirmButtonColor: '#4caf50'
                });

                // Close modal
                var elem = document.getElementById('updateModal');
                var instance = M.Modal.getInstance(elem);
                instance.close();

                // Refresh data
                $scope.getDataFunc();
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to update user',
                    icon: 'error',
                    confirmButtonColor: '#f44336'
                });
            }
        }, function (error) {
            console.error('Update error:', error);
            Swal.fire({
                title: 'Error!',
                text: 'An error occurred while updating',
                icon: 'error',
                confirmButtonColor: '#f44336'
            });
        });
    };

    // ARCHIVE Button Function
    $scope.archiveUser = function (registrationID) {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to archive this user?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f44336',
            cancelButtonColor: '#9e9e9e',
            confirmButtonText: 'Yes, archive it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                // Call the archive service
                var archivePromise = LifeProgAppService.archiveDataService(registrationID);

                archivePromise.then(function (response) {
                    Swal.fire({
                        title: 'Archived!',
                        text: 'User has been archived successfully',
                        icon: 'success',
                        confirmButtonColor: '#4caf50'
                    });

                    // Refresh the table data
                    $scope.getDataFunc();
                }, function (error) {
                    console.error('Archive error:', error);
                    Swal.fire({
                        title: 'Error!',
                        text: 'An error occurred while archiving',
                        icon: 'error',
                        confirmButtonColor: '#f44336'
                    });
                });
            }
        });
    };

    // Initialize data on page load
    $scope.getDataFunc();