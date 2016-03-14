/**
 * Created by prodigy4440 on 3/3/16.
 */
angular.module('MetronicApp').controller('RegionalCollectionController',
    function($rootScope, $scope, $http, $timeout,API, Toast, LocalStorage, $window) {
        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
            Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_link_profile')); // set profile link active in sidebar menu
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        var entity = LocalStorage.get(Constants.KEY_USER_INFO);
        if (entity == null || entity == undefined) {
            $window.location.href = "login.html";
        }

        $scope.loadDistrictDashboard = function () {
            $scope.config = {};
            $scope.config.headers = {};
            $scope.config.headers.sessionId = entity.token;
            $scope.config.params = {};
            $scope.config.params.start = '2016-02-01';
            $scope.config.params.end = '2016-03-13';


            var result = API.getCashinSummaryPerDistrict($scope.config);

            result.success(function (data) {
                if (data.status.code === 0) {
                    $scope.summary = data.entity.summary;
                    console.log(data.entity);
                } else if (data.status.code === 212) {
                    LocalStorage.removeImmediate(Constants.KEY_USER_INFO);
                    $window.location.href = "login.html";
                } else {
                    Toast.error(data.status.description);
                }

            });

        };
        $scope.loadDistrictDashboard();

        //$scope.loadPerDistrictSummary = function () {
        //    $scope.page = 0;
        //    $scope.size = 30;
        //
        //    $scope.config = {};
        //    $scope.config.headers = {};
        //    $scope.config.headers.sessionId = entity.token;
        //    $scope.config.params = {};
        //    $scope.config.params.size = $scope.size;
        //    $scope.config.params.page = $scope.page;
        //
        //
        //    var result = API.getCashinSummaryPerDistrict($scope.config);
        //
        //    result.success(function (data) {
        //        if (data.status.code === 0) {
        //            $scope.allcashins = data.entity;
        //            console.log(data.entity);
        //        } else if (data.status.code === 212) {
        //            LocalStorage.removeImmediate(Constants.KEY_USER_INFO);
        //            $window.location.href = "login.html";
        //        } else {
        //            Toast.error(data.status.description);
        //        }
        //
        //    });
        //
        //    result.error(function (data) {
        //        Toast.error("An error occurred, please check your internet and try again!" + (data || ""));
        //    });
        //};
        //$scope.loadPerDistrictSummary();
    });