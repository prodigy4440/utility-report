/**
 * Created by prodigy4440 on 3/3/16.
 */
angular.module('MetronicApp').controller('CashOfficeCashinController',
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

        $scope.businessunits = [];
        $scope.cashoffices = [];
        $scope.fetchBusinessunits = function () {
            var result = API.getBusinessUnits();
            result.success(function (data) {
                if (data.status.code === 0) {
                    console.log(data)
                    $scope.businessunits = data.entity;
                }

            });
        };
        $scope.fetchBusinessunits();

        $scope.fetchCashOffices = function () {
            var tempbu = JSON.parse($scope.district);
            var result = API.getBusinessUnitCashOffices(tempbu.name);
            result.success(function (data) {
                console.log(data)
                if (data.status.code === 0) {
                    $scope.cashoffices = data.entity;
                }

            });
        };

        $scope.changeCashOffice = function(){

            $scope.config = {};
            $scope.config.params = {};
            $scope.config.params.district = JSON.parse($scope.district).name;
            $scope.config.params.cashoffice = JSON.parse($scope.cf).name;
            $scope.config.params.cursor = -1;

            var result = API.getCashinPerDistrictPerCasshOffice($scope.config);

            result.success(function (data) {
                console.log(data);
                if (data.status.code === 0) {
                    $scope.transactions = data.entity;

                }

            });
        };

    });
