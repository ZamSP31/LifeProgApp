// ============================================================================
// Main Application Controller
// ============================================================================
app.controller("LifeProgAppController", ['$scope', '$window', '$timeout', 'LifeProgAppService', function ($scope, $window, $timeout, LifeProgAppService) {

    // ========================================================================
    // INITIALIZE VARIABLES
    // ========================================================================
    $scope.today = new Date();  // ← ADDED: Initialize today's date
    $scope.showSuccess = false;
    $scope.registeredUsers = [];
    $scope.isArchived = 0;
    $scope.todaysQuests = [];
    $scope.questPhotos = [];

    // ← ADDED: Variables from old Module.js (for form validation)
    $scope.user = {};  // object to store form data
    $scope.users = []; // array to store submitted users


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

    // ADDED: Simple registration (from old Module.js - for form validation)
    $scope.saveRegistrationSimple = function () {
        if ($scope.regForm.$valid) {
            $scope.users.push(angular.copy($scope.user));
            $scope.user = {};           // reset form model
            $scope.regForm.$setPristine();  // reset form state
            $scope.regForm.$setUntouched();
            alert('Registration saved successfully!');
        } else {
            alert('Please complete all required fields.');
        }
    };

    // EXISTING: Main registration (with API call)
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
                $scope.tableValue = returnedData.data.data;
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

    // ========================================================================
    // DELETE / ARCHIVE FUNCTION
    // ========================================================================
    $scope.archiveUser = function (registrationID) {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to archive this user?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f44336',
            cancelButtonColor: '#9e9e9e',
            confirmButtonText: 'Yes, archive it!'
        }).then((result) => {
            if (result.isConfirmed) {
                var archivePromise = LifeProgAppService.archiveDataService(registrationID);

                archivePromise.then(function (response) {
                    if (response.data.success) {
                        Swal.fire(
                            'Archived!',
                            'User has been archived.',
                            'success'
                        );
                        $scope.getDataFunc();
                    } else {
                        Swal.fire('Error', response.data.message || 'Failed to archive', 'error');
                    }
                }, function (error) {
                    console.error(error);
                    Swal.fire('Error', 'Server error occurred.', 'error');
                });
            }
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
    // NEW: QUEST PHOTO FUNCTIONS
    // ========================================================================

    // Upload photo for a specific quest
    $scope.uploadQuestPhoto = function (questId) {
        // Create a hidden file input
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = function (e) {
            var file = e.target.files[0];
            if (!file) return;

            // Show loading
            Swal.fire({
                title: 'Uploading...',
                text: 'Please wait while we upload your photo',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            var uploadPromise = LifeProgAppService.uploadQuestPhoto(file, questId);

            uploadPromise.then(function (response) {
                if (response.data.success) {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Photo uploaded successfully!',
                        icon: 'success',
                        confirmButtonColor: '#4caf50'
                    });

                    // Reload quests to show photo indicator
                    $scope.loadTodaysQuests();
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: response.data.message || 'Upload failed',
                        icon: 'error',
                        confirmButtonColor: '#f44336'
                    });
                }
            }, function (error) {
                console.error('Upload error:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'An error occurred while uploading',
                    icon: 'error',
                    confirmButtonColor: '#f44336'
                });
            });
        };

        input.click();
    };

    // View photos for a specific quest
    $scope.viewQuestPhotos = function (questId, questTitle) {
        var getPhotos = LifeProgAppService.getQuestPhotos(questId);

        getPhotos.then(function (response) {
            if (response.data.success && response.data.data.length > 0) {
                var images = response.data.data;
                var imageHtml = images.map(function (img) {
                    return `<img src="${img.imagePath}" style="max-width:100%; margin:10px 0; border-radius:8px;">`;
                }).join('');

                Swal.fire({
                    title: questTitle + ' - Photos',
                    html: imageHtml,
                    width: 600,
                    confirmButtonText: 'Close',
                    confirmButtonColor: '#1976d2'
                });
            } else {
                Swal.fire({
                    title: 'No Photos',
                    text: 'No photos uploaded for this quest yet.',
                    icon: 'info',
                    confirmButtonColor: '#1976d2'
                });
            }
        }, function (error) {
            console.error('Error loading photos:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to load photos',
                icon: 'error',
                confirmButtonColor: '#f44336'
            });
        });
    };

    // Load all quest photos for gallery
    $scope.loadAllQuestPhotos = function () {
        var userId = 1; // You can make this dynamic
        var getPhotos = LifeProgAppService.getAllQuestPhotos(userId);

        getPhotos.then(function (response) {
            if (response.data.success) {
                $scope.questPhotos = response.data.data;

                // Initialize carousel after photos are loaded
                $timeout(function () {
                    var elems = document.querySelectorAll('.carousel');
                    M.Carousel.init(elems, {
                        fullWidth: true,
                        indicators: true
                    });
                }, 100);
            }
        }, function (error) {
            console.error('Error loading quest photos:', error);
        });
    };

    // Load today's quests (for dashboard/goals page)
    $scope.loadTodaysQuests = function () {
        var userId = 1; // You can make this dynamic
        var getQuests = LifeProgAppService.getTodaysQuests(userId);

        getQuests.then(function (response) {
            if (response.data.success) {
                $scope.todaysQuests = response.data.data;
            }
        }, function (error) {
            console.error('Error loading quests:', error);
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