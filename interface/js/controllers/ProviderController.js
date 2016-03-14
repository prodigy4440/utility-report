/**
 * Created by prodigy4440 on 3/12/16.
 */

angular.module('MetronicApp').controller('ProviderController',
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

        $scope.providers = [];

        $scope.loadProvider = function(){
                $scope.config = {};
                $scope.config.headers = {};
                $scope.config.headers.sessionId = entity.token;

                var result = API.getProviders($scope.config);

                result.success(function (data) {
                    if (data.status.code === 0) {
                        $scope.providers = data.entity;
                        console.log(data)
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

        }

        $scope.loadProvider();


        $scope.providerChange= function(){
            $scope.config = {};
            $scope.config.headers = {};
            $scope.config.headers.sessionId = entity.token;
            $scope.config.params = {};
            $scope.config.params.provider = $scope.prv;
            $scope.config.params.cursor = -1;


            var result = API.getTransactionPerProvider($scope.config);

            result.success(function (data) {
                if (data.status.code === 0) {
                    $scope.scashins = data.entity;
                    console.log(data)
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

        }


    });
