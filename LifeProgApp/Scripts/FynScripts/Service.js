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