/**
 * Created by prodigy4440 on 3/3/16.
 */
angular.module('MetronicApp').controller('CrmController',
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


        $scope.loadAccountInfo = function () {

            $scope.config = {};
            $scope.config.headers = {};
            $scope.config.headers.sessionId = entity.token;
            $scope.config.params = {};
            $scope.config.params.meternumber = $scope.meternumber;


            var result = API.getCustomerAccountInfo($scope.config);

            result.success(function (data) {
                if (data.status.code === 0) {
                    console.log(data);
                    $scope.customer = data.entity.accounts[0];
                    console.log(data)
                } else if (data.status.code === 212) {
                    LocalStorage.removeImmediate(Constants.KEY_USER_INFO);
                    $window.location.href = "login.html";
                } else {
                    Toast.error(data.status.description);
                }

            });

            var iresult = API.getInvoices($scope.config);

            iresult.success(function (data) {
                if (data.status.code === 0) {
                    console.log(data);
                    $scope.invoices = data.entity;
                } else if (data.status.code === 212) {
                    LocalStorage.removeImmediate(Constants.KEY_USER_INFO);
                    $window.location.href = "login.html";
                } else {
                    Toast.error(data.status.description);
                }

            });

            iresult.error(function (data) {
                Toast.error("An error occurred, please check your internet and try again!" + (data || ""));
            });

            var fresult = API.getFaults($scope.config);

            fresult.success(function (data) {
                if (data.status.code === 0) {
                    $scope.faults = data.entity.w;
                } else if (data.status.code === 212) {
                    LocalStorage.removeImmediate(Constants.KEY_USER_INFO);
                    $window.location.href = "login.html";
                } else {
                    Toast.error(data.status.description);
                }

            });

            $scope.config.params.customerid = $scope.meternumber;
            $scope.config.params.cursor = 0;
            $scope.config.params.size = 25;

            var hresult = API.getCustomerTrnHistory($scope.config);

            hresult.success(function(data){
                if (data.status.code === 0) {
                    $scope.histories = data.entity.collection;
                } else if (data.status.code === 212) {
                    LocalStorage.removeImmediate(Constants.KEY_USER_INFO);
                    $window.location.href = "login.html";
                } else {
                    Toast.error(data.status.description);
                }
            });



        };

    });
