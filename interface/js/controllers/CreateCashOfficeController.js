/**
 * Created by prodigy4440 on 3/14/16.
 */

angular.module('MetronicApp').controller('CreateCashOfficeController',
    function($rootScope, $scope, $http, $timeout,API, Toast, LocalStorage, $window) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var entity = LocalStorage.get(Constants.KEY_USER_INFO);
    if (entity == null || entity == undefined) {
        $window.location.href = "login.html";
    }

    $scope.cashier = {};

$scope.loadBusinessDistrict = function(){

        $scope.config = {};
        $scope.config.headers = {};
        $scope.config.headers.sessionId = entity.token;
        $scope.config.params = {};

        var result = API.getBusinessUnits();

        result.success(function(data){
            if (data.status.code === 0) {
                $scope.businessunits = data.entity;
            } else if (data.status.code === 212) {
                LocalStorage.removeImmediate(Constants.KEY_USER_INFO);
                $window.location.href = "login.html";
            } else {
                Toast.error(data.status.description);
            }

        });
    };

    $scope.loadBusinessDistrict();


    $scope.loadCashOffices = function(){

        $scope.config = {};
        $scope.config.headers = {};
        $scope.config.headers.sessionId = entity.token;
        $scope.config.params = {};

        $scope.unitid = JSON.parse($scope.businessunit).id;
        $scope.unitname = JSON.parse($scope.businessunit).name;

        $scope.config.params.buid = $scope.unitid;
        var result = API.getRCMCreateCashOffice ($scope.config);

        result.success(function(data){
            if (data.status.code === 0) {
                $scope.cashoffices = data.entity;
            } else if (data.status.code === 212) {
                LocalStorage.removeImmediate(Constants.KEY_USER_INFO);
                $window.location.href = "login.html";
            } else {
                Toast.error(data.status.description);
            }

        });
    };


    $scope.createCashOffice = function(){

        $scope.config = {};
        $scope.config.headers = {};
        $scope.config.headers.sessionId = entity.token;
        $scope.config.params = {};

        $scope.cbuid = JSON.parse($scope.cashier.bu).id;
        $scope.cbuname = JSON.parse($scope.cashier.bu).name;

        $scope.config.params.name = $scope.cashier.name;
        $scope.config.params.address = $scope.cashier.address;
        $scope.config.params.bankref = $scope.cashier.bankref;
        $scope.config.params.description = $scope.cashier.description;
        $scope.config.params.buid = $scope.cbuid;
        $scope.config.params.buname = $scope.cbuname;

        var result = API.getCreateCashOffice($scope.config);

        result.success(function(data){
            if (data.status.code === 0) {
                $window.location.reload();
            } else if (data.status.code === 212) {
                LocalStorage.removeImmediate(Constants.KEY_USER_INFO);
                $window.location.href = "login.html";
            } else {
                Toast.error(data.status.description);
            }

        });
    };

        $scope.changeCashOfficeStatus = function(cash){

            var stat = cash.status;
            if(stat === "DISABLED"){
                stat = "ACTIVE";
            }else{
                stat = "DISABLED";
            }
                $scope.config = {};
                $scope.config.headers = {};
                $scope.config.headers.sessionId = entity.token;
                $scope.config.params = {};
                $scope.config.params.id = cash.id;
                $scope.config.params.status = stat;

                var result = API.changeRCMCashOfficeStatus($scope.config);

                result.success(function(data){
                    if (data.status.code === 0) {
                        $window.location.reload();
                    } else if (data.status.code === 212) {
                        LocalStorage.removeImmediate(Constants.KEY_USER_INFO);
                        $window.location.href = "login.html";
                    } else {
                        Toast.error(data.status.description);
                    }
                });
    };

        $scope.updateCashOffice = function(ucash){

            console.log(ucash.name);
            //$scope.config = {};
            //$scope.config.headers = {};
            //$scope.config.headers.sessionId = entity.token;
            //$scope.config.params = {};
            //$scope.config.params.id = cash.id;
            //$scope.config.params.status = stat;
            //
            //var result = API.changeRCMCashOfficeStatus($scope.config);
            //
            //result.success(function(data){
            //    if (data.status.code === 0) {
            //        $window.location.reload();
            //    } else if (data.status.code === 212) {
            //        LocalStorage.removeImmediate(Constants.KEY_USER_INFO);
            //        $window.location.href = "login.html";
            //    } else {
            //        Toast.error(data.status.description);
            //    }
            //});
        };


});