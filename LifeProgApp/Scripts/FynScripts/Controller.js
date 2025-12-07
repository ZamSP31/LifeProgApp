// ============================================================================
// Main Application Controller
// ============================================================================
app.controller("LifeProgAppController", ['$scope', '$window', '$timeout', 'LifeProgAppService', function ($scope, $window, $timeout, LifeProgAppService) {

    // ========================================================================
    // INITIALIZE VARIABLES
    // ========================================================================
    $scope.showSuccess = false;
    $scope.registeredUsers = [];
    $scope.isArchived = 0;


    // ========================================================================
    // NAVIGATION FUNCTIONS
    // ========================================================================
    $scope.redirectToLogin = function () {
        $window.location.href = "/Def/LoginPage";
    };

    $scope.redirectToRegistration = function () {
        $window.location.href = '/Def/RegistrationPage';
    };

    $scope.redirectToDashboard = function () {
        $window.location.href = '/Def/DashboardPage';
    };

    $scope.redirectToGoals = function () {
        $window.location.href = "/Def/GoalsPage";
    };

    $scope.redirectToProgress = function () {
        $window.location.href = '/Def/ProgressPage';
    };

    $scope.redirectToOverview = function () {
        $window.location.href = '/Def/OverviewPage';
    };

    $scope.redirectToGallery = function () {
        $window.location.href = '/Def/GalleryPage';
    };


    // ========================================================================
    // REGISTRATION FUNCTIONS
    // ========================================================================

    $scope.saveRegistration = function () {
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

        var userData = {
            "firstName": $scope.firstName,
            "lastName": $scope.lastName,
            "Gender": $scope.gender || "",
            "Email": $scope.email,
            "Password": $scope.password || ""
        };

        var saveData = LifeProgAppService.saveAccount(userData);

        saveData.then(function (response) {
            if (response && response.data && response.data.success) {
                if (response.data.message) {
                    alert(response.data.message);
                } else {
                    alert("Registration successful.");
                }
                $scope.registeredUsers.push(angular.copy(userData));
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

    $scope.cancelData = function () {
        $scope.firstName = null;
        $scope.lastName = null;
        $scope.gender = null;
        $scope.email = null;
        $scope.password = null;
        $scope.confirmPassword = null;
        $scope.showSuccess = false;
    };


    // ========================================================================
    // DATA RETRIEVAL FUNCTIONS
    // ========================================================================

    $scope.getDataFunc = function () {
        var getData = LifeProgAppService.getDataService();
        getData.then(function (returnedData) {
            if (returnedData.data && returnedData.data.data) {
                $scope.tableValue = returnedData.data.data;  // Access nested data
            } else {
                $scope.tableValue = [];
            }
        }, function (error) {
            console.error('Error loading data:', error);
            $scope.tableValue = [];
        });
    };


    // ========================================================================
    // ARCHIVE FUNCTIONS
    // ========================================================================

    $scope.archiveData = function (regID) {
        var getData = LifeProgAppService.archiveDataService(regID);
        getData.then(function (returnedData) {
            $scope.tableValue = returnedData.data;
        });
    };

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
                var archivePromise = LifeProgAppService.archiveDataService(registrationID);

                archivePromise.then(function (response) {
                    Swal.fire({
                        title: 'Archived!',
                        text: 'User has been archived successfully',
                        icon: 'success',
                        confirmButtonColor: '#4caf50'
                    });
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


    // ========================================================================
    // SWEETALERT & USER INTERACTION FUNCTIONS
    // ========================================================================

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


    // ========================================================================
    // UPDATE FUNCTIONS
    // ========================================================================

    $scope.updateUser = function (user) {
        $scope.selectedUser = angular.copy(user);
        var elem = document.getElementById('updateModal');
        var instance = M.Modal.getInstance(elem);
        instance.open();
    };

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

        var updateData = {
            registrationID: $scope.selectedUser.registrationID,
            firstName: $scope.selectedUser.firstName,
            lastName: $scope.selectedUser.lastName
        };

        var updatePromise = LifeProgAppService.updateUserService(updateData);

        updatePromise.then(function (response) {
            if (response && response.data && response.data.success) {
                Swal.fire({
                    title: 'Updated!',
                    text: 'User has been updated successfully',
                    icon: 'success',
                    confirmButtonColor: '#4caf50'
                });
                var elem = document.getElementById('updateModal');
                var instance = M.Modal.getInstance(elem);
                instance.close();
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


    // ========================================================================
    // FILE UPLOAD FUNCTIONS
    // ========================================================================

    $scope.uploadfile = function () {
        var input = document.getElementById('fileInput');
        var file = input.files[0];

        if (!file) {
            alert("Please select a file first");
            return;
        }

        var uploadData = LifeProgAppService.uploadFile(file);
        uploadData.then(function (returnedData) {
            if (returnedData && returnedData.data) {
                alert(returnedData.data.Message);
                $scope.getCarouselImages();
            }
        });
    };


    // ========================================================================
    // CAROUSEL/GALLERY FUNCTIONS
    // ========================================================================

    $scope.getCarouselImages = function () {
        var getData = LifeProgAppService.getCarouselImagesService();
        getData.then(function (returnedData) {
            $scope.carouselImages = returnedData.data;

            $timeout(function () {
                var elems = document.querySelectorAll('.carousel');
                M.Carousel.init(elems, {
                    fullWidth: true,
                    indicators: true
                });
            }, 100);
        });
    };

}]);