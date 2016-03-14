/**
 * Created by prodigy4440 on 3/4/16.
 */
angular.module('MetronicApp').controller('TransactionController',
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

        $scope.fetchProfile = function () {

            $scope.config = {};
            $scope.config.headers = {};
            $scope.config.headers.sessionId = entity.token;
            $scope.config.params = {};
            $scope.config.params.cursor = -1;

            var result = API.getTransactions($scope.config);

            result.success(function (data) {
                if (data.status.code === 0) {
                    console.log(data);
                    $scope.transactions = data.entity;
                } else if (data.status.code === 212) {
                    LocalStorage.removeImmediate(Constants.KEY_USER_INFO);
                    $window.location.href = "login.html";
                } else {
                    Toast.error(data.status.description);
                }

            });

            result.error(function (data) {
                Toast.error( "An error occurred, please check your internet and try again!" + (data || ""));
            });
        };
        $scope.fetchProfile();
});
