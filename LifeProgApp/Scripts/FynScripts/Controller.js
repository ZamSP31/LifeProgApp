// ============================================================================
// Main Application Controller
// ============================================================================
app.controller("LifeProgAppController", ['$scope', '$window', '$timeout', 'LifeProgAppService', function ($scope, $window, $timeout, LifeProgAppService) {

    // ========================================================================
    // INITIALIZE VARIABLES
    // ========================================================================
    $scope.today = new Date();
    $scope.showSuccess = false;
    $scope.registeredUsers = [];
    $scope.isArchived = 0;
    $scope.todaysQuests = [];
    $scope.questPhotos = [];
    $scope.user = {};
    $scope.users = [];


    // ========================================================================
    // CHART VARIABLES
    // ========================================================================

    $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    $scope.series = ['Series A', 'Series B'];

    $scope.data = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];


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

    $scope.saveRegistrationSimple = function () {
        if ($scope.regForm.$valid) {
            $scope.users.push(angular.copy($scope.user));
            $scope.user = {};
            $scope.regForm.$setPristine();
            $scope.regForm.$setUntouched();
            alert('Registration saved successfully!');
        } else {
            alert('Please complete all required fields.');
        }
    };

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
    // UPDATE FUNCTIONS - SIMPLE ALERT VERSION
    // ========================================================================

    $scope.updateUser = function (user) {
        console.log('Updating user:', user);

        // Simple prompts for input
        var firstName = prompt('Enter First Name:', user.firstName);
        if (firstName === null) return; // User cancelled

        var lastName = prompt('Enter Last Name:', user.lastName);
        if (lastName === null) return; // User cancelled

        var email = prompt('Enter Email:', user.email || '');
        if (email === null) return; // User cancelled

        // Validate
        if (!firstName || !lastName) {
            alert('First Name and Last Name are required!');
            return;
        }

        // Prepare data
        var updateData = {
            registrationID: user.registrationID,
            firstName: firstName,
            lastName: lastName,
            email: email
        };

        console.log('Update Data Being Sent:', updateData);

        // Send update request
        var updatePromise = LifeProgAppService.updateUserService(updateData);

        updatePromise.then(function (response) {
            console.log('Update Response:', response);

            if (response && response.data && response.data.success) {
                alert('User updated successfully!');
                $scope.getDataFunc(); // Refresh the table
            } else {
                alert('Error: ' + (response.data.message || 'Failed to update user'));
            }
        }, function (error) {
            console.error('Update error:', error);
            alert('Error: ' + (error.data?.message || error.statusText || 'An error occurred'));
        });
    };


    // ========================================================================
    // SIMPLIFIED PHOTO UPLOAD WITH DESCRIPTION
    // ========================================================================

    $scope.uploadPhotoToGallery = function () {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = function (e) {
            var file = e.target.files[0];
            if (!file) return;

            // Check file size (5 MB = 5 * 1024 * 1024 bytes)
            var maxSize = 5 * 1024 * 1024; // 5 MB
            if (file.size > maxSize) {
                alert('Error: File is too large. Maximum size is 5 MB. Your file is ' + (file.size / 1024 / 1024).toFixed(2) + ' MB');
                return;
            }

            // Check file type
            if (!file.type.startsWith('image/')) {
                alert('Error: Please select an image file');
                return;
            }

            // Ask for description
            var description = prompt('Add a short description for this photo:');
            if (description === null) return; // User cancelled

            if (!description || description.trim() === '') {
                alert('Please provide a description for the photo.');
                return;
            }

            alert('Uploading photo...');

            // Upload the file with description
            var uploadPromise = LifeProgAppService.uploadPhotoWithDescription(file, description);

            uploadPromise.then(function (response) {
                console.log('Upload response:', response);

                if (response.data && response.data.success) {
                    alert('Success: Photo uploaded successfully!');
                    // Reload the gallery - NO $scope.$apply() needed!
                    $scope.getCarouselImages();
                } else {
                    alert('Error: ' + (response.data?.message || 'Upload failed'));
                }
            }, function (error) {
                console.error('Upload error:', error);

                // Better error handling
                var errorMessage = 'An error occurred while uploading';

                if (error.status === 500) {
                    errorMessage = 'Server error. File might be too large.';
                } else if (error.status === 404) {
                    errorMessage = 'Upload endpoint not found.';
                } else if (error.data && error.data.message) {
                    errorMessage = error.data.message;
                }

                alert('Error: ' + errorMessage);
            });
        };

        input.click();
    };


    // ========================================================================
    // DASHBOARD QUEST FUNCTIONS
    // ========================================================================

    // Load today's quests
    $scope.loadTodaysQuests = function () {
        var userId = 1;
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
    // GALLERY FUNCTIONS
    // ========================================================================

    $scope.getCarouselImages = function () {
        var getData = LifeProgAppService.getCarouselImagesService();
        getData.then(function (returnedData) {
            $scope.carouselImages = returnedData.data;
        });
    };


    // ========================================================================
    // CHART FUNCTIONS
    // ========================================================================

    // Load user status chart data
    $scope.loadUserStatusChart = function () {
        console.log("Loading user status chart...");

        var getData = LifeProgAppService.getUserStatusChart();

        getData.then(function (response) {
            console.log("Chart data received:", response.data);

            if (response.data.success) {
                $scope.userStatusData = [
                    response.data.data.active,
                    response.data.data.archived
                ];
                $scope.userStatusLabels = ['Active Users', 'Archived Users'];
                $scope.userStatusColors = ['#4caf50', '#f44336'];

                console.log("Chart configured:", $scope.userStatusData);
            }
        }, function (error) {
            console.error('Error loading chart data:', error);
        });
    };


    // ========================================================================
    // PDF MAKER
    // ========================================================================

    $scope.downloadPDF = function () {
        // ==========================================================
        // 1. LINK FONTS (Standardized for v0.2.7)
        // ==========================================================
        try {
            // If this line fails, it means vfs_fonts.js didn't load from the CDN
            if (typeof pdfFonts === 'undefined') {
                alert("Error: The font script (vfs_fonts.js) did not load. Please check your internet connection.");
                return;
            }
            // Link the virtual file system
            pdfMake.vfs = pdfFonts.pdfMake.vfs;
        } catch (e) {
            console.error("Font Linking Error:", e);
            alert("Error: Could not link fonts. Check console.");
            return;
        }

        // ==========================================================
        // 2. PREPARE DATA
        // ==========================================================
        var bodyData = [
            [
                { text: 'ID', style: 'tableHeader' },
                { text: 'First Name', style: 'tableHeader' },
                { text: 'Last Name', style: 'tableHeader' },
                { text: 'Email', style: 'tableHeader' },
                { text: 'Status', style: 'tableHeader' }
            ]
        ];

        // Use the data loaded from your database
        var dataSource = $scope.tableValue || [];

        dataSource.forEach(function (user) {
            var status = user.isArchived == 0 ? 'Active' : 'Archived';
            bodyData.push([
                user.registrationID.toString(),
                user.firstName,
                user.lastName,
                user.email,
                status
            ]);
        });

        // ==========================================================
        // 3. DEFINE DOCUMENT
        // ==========================================================
        var docDefinition = {
            // 'Roboto' is the default font included in version 0.2.7
            defaultStyle: {
                font: 'Roboto'
            },
            content: [
                { text: 'User Report', style: 'header' },
                {
                    style: 'tableExample',
                    table: {
                        headerRows: 1,
                        widths: ['auto', '*', '*', '*', 'auto'],
                        body: bodyData
                    },
                    layout: 'lightHorizontalLines'
                }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 20]
                },
                tableHeader: {
                    bold: true,
                    fontSize: 12,
                    color: 'black',
                    fillColor: '#eeeeee'
                },
                tableExample: {
                    margin: [0, 5, 0, 15]
                }
            }
        };

        // 4. DOWNLOAD
        pdfMake.createPdf(docDefinition).download('user_report.pdf');
    };


}]);