angular.module('MetronicApp').controller('DashboardController',
    function ($rootScope, $scope, $http, $timeout, API, Toast, LocalStorage, $window) {
        $scope.$on('$viewContentLoaded', function () {
            // initialize core components
            App.initAjax();
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        $scope.inp = 1;

        var entity = LocalStorage.get(Constants.KEY_USER_INFO);
        if (entity == null || entity == undefined) {
            $window.location.href = "login.html";
        }

        $scope.loadDbSummary = function () {

            $scope.config = {};
            $scope.config.headers = {};
            $scope.config.headers.sessionId = entity.token;


            var result = API.getDbSummary($scope.config);

            result.success(function (data) {
                if (data.status.code === 0) {
                    $scope.dbsum = data.entity;
                } else if (data.status.code === 212) {
                    LocalStorage.removeImmediate(Constants.KEY_USER_INFO);
                    $window.location.href = "login.html";
                } else {
                    Toast.error(data.status.description);
                }

            });

            result.error(function (data) {
                Toast.error("An error occurred, please check your internet and try again!" + (data || ""));
            });
        };

        $scope.loadBankBalace = function () {

            $scope.config = {};
            $scope.config.headers = {};
            $scope.config.headers.sessionId = entity.token;


            var result = API.getBankBalance($scope.config);

            result.success(function (data) {
                if (data.status.code === 0) {
                    $scope.bank = data.entity;
                } else if (data.status.code === 212) {
                    LocalStorage.removeImmediate(Constants.KEY_USER_INFO);
                    $window.location.href = "login.html";
                } else {
                    Toast.error(data.status.description);
                }

            });

            result.error(function (data) {
                Toast.error("An error occurred, please check your internet and try again!" + (data || ""));
            });
        };

        $scope.loadDbSummary();
        $scope.loadBankBalace();


        $scope.loadTodaySummary = function () {

            $scope.config = {};
            $scope.config.headers = {};
            $scope.config.headers.sessionId = entity.token;


            var result = API.getTodaySummary($scope.config);

            result.success(function (data) {
                if (data.status.code === 0) {
                    $scope.rtsum = data.entity;
                    console.log(data);
                } else if (data.status.code === 212) {
                    LocalStorage.removeImmediate(Constants.KEY_USER_INFO);
                    $window.location.href = "login.html";
                } else {
                    Toast.error(data.status.description);
                }

            });

            result.error(function (data) {
                Toast.error("An error occurred, please check your internet and try again!" + (data || ""));
            });
        };


        $scope.loadThisWeekSummary = function () {

            $scope.config = {};
            $scope.config.headers = {};
            $scope.config.headers.sessionId = entity.token;


            var result = API.getThisWeekSummary($scope.config);

            result.success(function (data) {
                if (data.status.code === 0) {
                    $scope.rtsum = data.entity;
                    console.log(data);
                } else if (data.status.code === 212) {
                    LocalStorage.removeImmediate(Constants.KEY_USER_INFO);
                    $window.location.href = "login.html";
                } else {
                    Toast.error(data.status.description);
                }

            });

            result.error(function (data) {
                Toast.error("An error occurred, please check your internet and try again!" + (data || ""));
            });
        };


        $scope.loadThisMonthSummary = function () {

            $scope.config = {};
            $scope.config.headers = {};
            $scope.config.headers.sessionId = entity.token;


            var result = API.getThisMonthSummary($scope.config);

            result.success(function (data) {
                if (data.status.code === 0) {
                    $scope.rtsum = data.entity;
                    console.log(data);
                } else if (data.status.code === 212) {
                    LocalStorage.removeImmediate(Constants.KEY_USER_INFO);
                    $window.location.href = "login.html";
                } else {
                    Toast.error(data.status.description);
                }

            });

            result.error(function (data) {
                Toast.error("An error occurred, please check your internet and try again!" + (data || ""));
            });
        };


        $scope.loadTodayEarning= function () {

            $scope.config = {};
            $scope.config.headers = {};
            $scope.config.headers.sessionId = entity.token;


            var result = API.getTodayEarning($scope.config);

            result.success(function (data) {
                if (data.status.code === 0) {
                    $scope.earning = data.entity;
                    console.log(data);
                } else if (data.status.code === 212) {
                    LocalStorage.removeImmediate(Constants.KEY_USER_INFO);
                    $window.location.href = "login.html";
                } else {
                    Toast.error(data.status.description);
                }

            });

            result.error(function (data) {
                Toast.error("An error occurred, please check your internet and try again!" + (data || ""));
            });
        };


        $scope.loadWeekEarning= function () {

            $scope.config = {};
            $scope.config.headers = {};
            $scope.config.headers.sessionId = entity.token;


            var result = API.getWeekEarning($scope.config);

            result.success(function (data) {
                if (data.status.code === 0) {
                    $scope.earning = data.entity;
                    console.log(data);
                } else if (data.status.code === 212) {
                    LocalStorage.removeImmediate(Constants.KEY_USER_INFO);
                    $window.location.href = "login.html";
                } else {
                    Toast.error(data.status.description);
                }

            });

            result.error(function (data) {
                Toast.error("An error occurred, please check your internet and try again!" + (data || ""));
            });
        };

        $scope.loadMonthEarning= function () {

            $scope.config = {};
            $scope.config.headers = {};
            $scope.config.headers.sessionId = entity.token;


            var result = API.getMonthEarning($scope.config);

            result.success(function (data) {
                if (data.status.code === 0) {
                    $scope.earning = data.entity;
                    $scope.earning.nsum = getTotalSum($scope.earning);
                    $scope.earning.tsum = getTransactionSum($scope.earning);

                } else if (data.status.code === 212) {
                    LocalStorage.removeImmediate(Constants.KEY_USER_INFO);
                    $window.location.href = "login.html";
                } else {
                    Toast.error(data.status.description);
                }

            });

            result.error(function (data) {
                Toast.error("An error occurred, please check your internet and try again!" + (data || ""));
            });
        };

    });

function getTotalSum(data){
    var sum = 0;
    if((data === null) || (data === undefined)){
        return sum;
    }else{
        for(var i = 0; i< data.length ; i++){
            sum = sum +parseFloat(data[i][1]);
        }
        return sum;
    }
}


function getTransactionSum(data){
    var sum = 0;
    if((data === null) || (data === undefined)){
        return sum;
    }else{
        for(var i = 0; i< data.length ; i++){
            sum = sum +parseFloat(data[i][2]);
        }
        return sum;
    }
}