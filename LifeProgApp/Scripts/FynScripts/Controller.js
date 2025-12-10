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
    $scope.allUsersForPDF = []; // Store ALL users including archived

    // ========================================================================
    // CHART OPTIONS - FIXED SIZE
    // ========================================================================
    $scope.chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1,
        legend: {
            display: false
        },
        tooltips: {
            callbacks: {
                label: function (tooltipItem, data) {
                    var label = data.labels[tooltipItem.index] || '';
                    var value = data.datasets[0].data[tooltipItem.index];
                    var total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                    var percentage = ((value / total) * 100).toFixed(1);
                    return label + ': ' + value + ' (' + percentage + '%)';
                }
            }
        }
    };

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
    // DATA RETRIEVAL FUNCTIONS - MODIFIED TO GET ALL USERS
    // ========================================================================

    $scope.getDataFunc = function () {
        var getData = LifeProgAppService.getDataService();
        getData.then(function (returnedData) {
            if (returnedData.data && returnedData.data.data) {
                // For display table - only active users
                $scope.tableValue = returnedData.data.data;

                // Store ALL users for PDF (need to fetch all including archived)
                $scope.getAllUsersForPDF();
            } else {
                $scope.tableValue = [];
                $scope.allUsersForPDF = [];
            }
        }, function (error) {
            console.error('Error loading data:', error);
            $scope.tableValue = [];
            $scope.allUsersForPDF = [];
        });
    };

    // NEW: Get ALL users including archived for PDF
    $scope.getAllUsersForPDF = function () {
        // This should call a service that gets ALL users
        // For now, we'll use a workaround
        var getAllData = LifeProgAppService.getAllDataService();
        getAllData.then(function (returnedData) {
            if (returnedData.data && returnedData.data.data) {
                $scope.allUsersForPDF = returnedData.data.data;
                console.log("All users loaded for PDF:", $scope.allUsersForPDF.length);
            }
        }, function (error) {
            console.error('Error loading all users:', error);
            // Fallback: use tableValue if getAllData fails
            $scope.allUsersForPDF = $scope.tableValue;
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
                        $scope.loadUserStatusChart();
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

        $timeout(function () {
            var elem = document.getElementById('updateModal');
            if (elem) {
                var instance = M.Modal.getInstance(elem);
                if (!instance) {
                    instance = M.Modal.init(elem);
                }
                instance.open();
            }
        }, 100);
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
                if (instance) {
                    instance.close();
                }
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
    // QUEST PHOTO FUNCTIONS
    // ========================================================================

    $scope.uploadQuestPhoto = function (questId) {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = function (e) {
            var file = e.target.files[0];
            if (!file) return;

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

    $scope.loadAllQuestPhotos = function () {
        console.log("=== Loading quest photos ===");
        var userId = 1;
        var getPhotos = LifeProgAppService.getAllQuestPhotos(userId);

        getPhotos.then(function (response) {
            console.log("Response:", response);
            if (response.data.success) {
                $scope.questPhotos = response.data.data;
                console.log("Quest photos loaded:", $scope.questPhotos.length);
            }
        }, function (error) {
            console.error('Error loading quest photos:', error);
        });
    };

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
    // CAROUSEL/GALLERY FUNCTIONS
    // ========================================================================

    $scope.getCarouselImages = function () {
        var getData = LifeProgAppService.getCarouselImagesService();
        getData.then(function (returnedData) {
            $scope.carouselImages = returnedData.data;

            if ($scope.carouselImages && $scope.carouselImages.length > 0) {
                $timeout(function () {
                    var elems = document.querySelectorAll('.carousel');
                    if (elems.length > 0) {
                        M.Carousel.init(elems, {
                            fullWidth: true,
                            indicators: true
                        });
                    }
                }, 200);
            }
        });
    };


    // ========================================================================
    // CHART FUNCTIONS
    // ========================================================================

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
                $scope.userStatusLabels = ['Active', 'Archived'];
                $scope.userStatusColors = ['#4caf50', '#f44336'];

                console.log("Chart configured:", $scope.userStatusData);
            }
        }, function (error) {
            console.error('Error loading chart data:', error);
            $scope.userStatusData = [0, 0];
            $scope.userStatusLabels = ['Active', 'Archived'];
            $scope.userStatusColors = ['#4caf50', '#f44336'];
        });
    };


    // ========================================================================
    // PDF MAKER - USES ALL USERS INCLUDING ARCHIVED
    // ========================================================================

    $scope.downloadPDF = function () {
        if (typeof pdfMake === 'undefined') {
            Swal.fire({
                title: 'Error!',
                text: 'PDF library not loaded. Please check your internet connection.',
                icon: 'error',
                confirmButtonColor: '#f44336'
            });
            return;
        }

        try {
            if (typeof pdfFonts !== 'undefined') {
                pdfMake.vfs = pdfFonts.pdfMake.vfs;
            }
        } catch (e) {
            console.error("Font Linking Error:", e);
        }

        var reportDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        var tableBody = [
            [
                { text: 'ID', style: 'tableHeader' },
                { text: 'First Name', style: 'tableHeader' },
                { text: 'Last Name', style: 'tableHeader' },
                { text: 'Created Date', style: 'tableHeader' },
                { text: 'Status', style: 'tableHeader' }
            ]
        ];

        // CRITICAL FIX: Use allUsersForPDF which includes archived users
        // If allUsersForPDF is empty, fall back to combining tableValue with a new query
        var dataSource = [];

        if ($scope.allUsersForPDF && $scope.allUsersForPDF.length > 0) {
            dataSource = $scope.allUsersForPDF;
            console.log("Using allUsersForPDF:", dataSource.length, "users");
        } else {
            // Fallback: use tableValue (but this only has active users)
            dataSource = $scope.tableValue || [];
            console.log("WARNING: Using tableValue only (may be missing archived users):", dataSource.length);
        }

        if (dataSource.length === 0) {
            Swal.fire({
                title: 'No Data',
                text: 'No data available to export. Please add users first.',
                icon: 'warning',
                confirmButtonColor: '#f39c12'
            });
            return;
        }

        // Count all users properly
        var activeCount = 0;
        var archivedCount = 0;

        dataSource.forEach(function (user) {
            var isArchived = (user.isArchived == 1 || user.isArchived === true);
            var status = isArchived ? 'Archived' : 'Active';

            try {
                var createdDate = new Date(parseInt(user.createdAt.substr(6)));
            } catch (e) {
                var createdDate = new Date();
            }

            if (isArchived) {
                archivedCount++;
            } else {
                activeCount++;
            }

            tableBody.push([
                { text: user.registrationID.toString(), alignment: 'left' },
                { text: user.firstName, alignment: 'left' },
                { text: user.lastName, alignment: 'left' },
                { text: createdDate.toLocaleDateString('en-US'), alignment: 'left' },
                {
                    text: status,
                    alignment: 'left',
                    color: isArchived ? '#c0392b' : '#27ae60',
                    bold: false
                }
            ]);
        });

        var totalUsers = dataSource.length;
        var activePercentage = totalUsers > 0 ? ((activeCount / totalUsers) * 100).toFixed(1) : '0.0';
        var archivedPercentage = totalUsers > 0 ? ((archivedCount / totalUsers) * 100).toFixed(1) : '0.0';

        console.log("PDF Stats - Total:", totalUsers, "Active:", activeCount, "Archived:", archivedCount);

        var docDefinition = {
            pageSize: 'LETTER',
            pageMargins: [50, 70, 50, 50],

            header: function (currentPage, pageCount) {
                return {
                    columns: [
                        {
                            text: 'User Management System Report',
                            fontSize: 11,
                            bold: true,
                            margin: [50, 25, 0, 0]
                        },
                        {
                            text: 'Page ' + currentPage + ' of ' + pageCount,
                            alignment: 'right',
                            margin: [0, 25, 50, 0],
                            fontSize: 9,
                            color: '#666'
                        }
                    ]
                };
            },

            footer: function (currentPage, pageCount) {
                return {
                    columns: [
                        {
                            text: '© 2025 One %',
                            fontSize: 8,
                            color: '#888',
                            margin: [50, 10, 0, 0]
                        },
                        {
                            text: 'Generated: ' + new Date().toLocaleDateString(),
                            alignment: 'right',
                            fontSize: 8,
                            color: '#888',
                            margin: [0, 10, 50, 0]
                        }
                    ]
                };
            },

            content: [
                {
                    text: 'USER REPORT',
                    fontSize: 20,
                    bold: true,
                    margin: [0, 0, 0, 5]
                },
                {
                    text: 'Generated on ' + reportDate,
                    fontSize: 10,
                    color: '#666',
                    margin: [0, 0, 0, 20]
                },

                {
                    canvas: [
                        {
                            type: 'line',
                            x1: 0, y1: 0,
                            x2: 515, y2: 0,
                            lineWidth: 1,
                            lineColor: '#ddd'
                        }
                    ],
                    margin: [0, 0, 0, 15]
                },

                {
                    text: 'Summary Statistics',
                    fontSize: 13,
                    bold: true,
                    margin: [0, 0, 0, 12]
                },
                {
                    columns: [
                        {
                            width: '33%',
                            stack: [
                                {
                                    text: 'Total Users',
                                    fontSize: 9,
                                    color: '#666',
                                    margin: [0, 0, 0, 3]
                                },
                                {
                                    text: totalUsers.toString(),
                                    fontSize: 22,
                                    bold: true
                                }
                            ]
                        },
                        {
                            width: '33%',
                            stack: [
                                {
                                    text: 'Active Users',
                                    fontSize: 9,
                                    color: '#666',
                                    margin: [0, 0, 0, 3]
                                },
                                {
                                    text: activeCount + ' (' + activePercentage + '%)',
                                    fontSize: 22,
                                    bold: true,
                                    color: '#27ae60'
                                }
                            ]
                        },
                        {
                            width: '34%',
                            stack: [
                                {
                                    text: 'Archived Users',
                                    fontSize: 9,
                                    color: '#666',
                                    margin: [0, 0, 0, 3]
                                },
                                {
                                    text: archivedCount + ' (' + archivedPercentage + '%)',
                                    fontSize: 22,
                                    bold: true,
                                    color: '#c0392b'
                                }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 20]
                },

                {
                    canvas: [
                        {
                            type: 'line',
                            x1: 0, y1: 0,
                            x2: 515, y2: 0,
                            lineWidth: 1,
                            lineColor: '#ddd'
                        }
                    ],
                    margin: [0, 0, 0, 15]
                },

                {
                    text: 'User Details',
                    fontSize: 13,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                {
                    table: {
                        headerRows: 1,
                        widths: [35, 90, 90, 85, 65],
                        body: tableBody
                    },
                    layout: {
                        fillColor: function (rowIndex) {
                            if (rowIndex === 0) return '#2c3e50';
                            return (rowIndex % 2 === 0) ? '#f9f9f9' : null;
                        },
                        hLineWidth: function (i, node) {
                            if (i === 0 || i === 1) return 1;
                            if (i === node.table.body.length) return 1;
                            return 0.5;
                        },
                        vLineWidth: function () {
                            return 0;
                        },
                        hLineColor: function (i) {
                            if (i === 0 || i === 1) return '#2c3e50';
                            return '#e0e0e0';
                        },
                        paddingLeft: function () { return 8; },
                        paddingRight: function () { return 8; },
                        paddingTop: function () { return 6; },
                        paddingBottom: function () { return 6; }
                    }
                },

            ],

            styles: {
                tableHeader: {
                    bold: true,
                    fontSize: 10,
                    color: 'white',
                    alignment: 'left'
                }
            },

            defaultStyle: {
                font: 'Roboto',
                fontSize: 10
            }
        };

        try {
            var fileName = 'Report_PDF' + new Date().toISOString().split('T')[0] + '.pdf';
            pdfMake.createPdf(docDefinition).download(fileName);

            Swal.fire({
                title: 'Success!',
                text: 'PDF report generated successfully',
                icon: 'success',
                confirmButtonColor: '#4caf50',
                timer: 2000
            });
        } catch (error) {
            console.error("PDF Generation Error:", error);
            Swal.fire({
                title: 'Error!',
                text: 'Error generating PDF. Please try again.',
                icon: 'error',
                confirmButtonColor: '#f44336'
            });
        }
    };


}]);