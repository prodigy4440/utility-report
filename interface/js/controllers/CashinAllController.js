/**
 * Created by prodigy4440 on 3/7/16.
 */

angular.module('MetronicApp').controller('CashinAllController',
    function($rootScope, $scope, $http, $timeout,API, Toast, LocalStorage, $window) {
        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
            Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_link_profile')); // set profile link active in sidebar menu
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageBodySolid = true;
        //$rootScope.settings.layout.pageSidebarClosed = true;

        var entity = LocalStorage.get(Constants.KEY_USER_INFO);
        if (entity == null || entity == undefined) {
            $window.location.href = "login.html";
        }

        $scope.loadAllCashin = function () {
            $scope.page = 0;
            $scope.size = 30;

            $scope.config = {};
            $scope.config.headers = {};
            $scope.config.headers.sessionId = entity.token;
            $scope.config.params = {};
            $scope.config.params.size = $scope.size;
            $scope.config.params.page = $scope.page;


            var result = API.getAllCashin($scope.config);

            result.success(function (data) {
                if (data.status.code === 0) {
                    $scope.allcashins = data.entity;
                    console.log(data.entity);
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
        $scope.loadAllCashin();


    });