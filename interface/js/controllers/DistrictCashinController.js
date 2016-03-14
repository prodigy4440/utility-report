/**
 * Created by prodigy4440 on 3/12/16.
 */
angular.module('MetronicApp').controller('DistrictCashinController',
    function ($rootScope, $scope, $http, $timeout, API, Toast, LocalStorage, $window) {
        $scope.$on('$viewContentLoaded', function () {
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

        $scope.cashin = {};

        $scope.businessunits = [];
        $scope.fetchBusinessunits = function () {
            var result = API.getBusinessUnits();
            result.success(function (data) {
                if (data.status.code === 0) {
                    $scope.businessunits = data.entity;
                }

            });
        };

        $scope.fetchBusinessunits();

        $scope.loadCashin = function () {
            var district = JSON.parse($scope.cashin.district).uniqueIdentifier;


            $scope.config = {};
            $scope.config.headers = {};
            $scope.config.headers.sessionId = entity.token;
            $scope.config.params = {};
            $scope.config.params.district = district;

            var result = API.getCashinPerDistrict($scope.config);

            result.success(function (data) {
                if (data.status.code === 0) {
                    $scope.monthcashin = data.entity;
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

        $scope.loadCountByStatusPerDistrict = function () {
            var district = JSON.parse($scope.cashin.district).uniqueIdentifier;


            $scope.config = {};
            $scope.config.headers = {};
            $scope.config.headers.sessionId = entity.token;
            $scope.config.params = {};
            $scope.config.params.district = district;

            var result = API.getCountByStatusPerDistrict($scope.config);

            result.success(function (data) {
                if (data.status.code === 0) {
                    $scope.stat = data.entity;
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

function extractCashinStat(data){
    var stat = {};

    stat.success = 0;
    stat.pending = 0;
    stat.declined = 0;
    stat.expired = 0;

    if((data === null) || (typeof data === undefined)){
        return stat;
    }else{
        var d1  = data[0];
        if((d1 !== null) || (typeof d1 !== undefined)){
            switch(d1[0]){
                case 0:
                    stat.pending = d1[1];
                    break;
                case 1:
                    stat.success = d1[1];
                    break;
                case 2:
                    stat.declined = d1[1];
                    break;
                case 3:
                    stat.expired = d1[1];
                    break;
                case 4:
                    break;
                default:
            }
        }

        var d2 = data[1];
        if((d2 !== null) || (typeof d2 !== undefined)){
            switch(d2[0]){
                case 0:
                    stat.pending = d2[1];
                    break;
                case 1:
                    stat.success = d2[1];
                    break;
                case 2:
                    stat.declined = d2[1];
                    break;
                case 3:
                    stat.expired = d2[1];
                    break;
                case 4:
                    break;
                default:
            }
        }

        var d3 = data[2];
        if((d3 !== null) || (typeof d3!== undefined)){
            switch(d3[0]){
                case 0:
                    stat.pending = d3[1];
                    break;
                case 1:
                    stat.success = d3[1];
                    break;
                case 2:
                    stat.declined = d3[1];
                    break;
                case 3:
                    stat.expired = d3[1];
                    break;
                case 4:
                    break;
                default:
            }
        }

        var d4 = data[3];
        if((d4 !== null) || (typeof d4 !== undefined)){
            switch(d4[0]){
                case 0:
                    stat.pending = d4[1];
                    break;
                case 1:
                    stat.success = d4[1];
                    break;
                case 2:
                    stat.declined = d4[1];
                    break;
                case 3:
                    stat.expired = d4[1];
                    break;
                case 4:
                    break;
                default:
            }
        }

        return stat;
    }

}