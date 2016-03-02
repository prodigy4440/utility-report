/* Setup general page controller */
angular.module('MetronicApp').controller('GeneralPageController',
    ['$rootScope', '$scope', 'settings', 'API', 'Toast', "LocalStorage", "$window",
        function ($rootScope, $scope, settings, API, Toast, LocalStorage, $window) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                App.initAjax();

                // set default layout mode
                $rootScope.settings.layout.pageContentWhite = true;
                $rootScope.settings.layout.pageBodySolid = false;
                $rootScope.settings.layout.pageSidebarClosed = false;
            });

            var entity = LocalStorage.get(Constants.KEY_USER_INFO);

            if (entity == null || entity == undefined) {
                $window.location.href = "login.html";
            }

            $scope.loadUsers = function () {
                var result = API.getUsers(entity.token);

                result.success(function (data) {
                    if (data.status.code === 0) {
                        $scope.users = data.entity;
                        console.log($scope.users);
                    } else if (data.status.code === 212) {
                        LocalStorage.removeImmediate(Constants.KEY_USER_INFO);
                        $window.location.href = "login.html";
                    } else {
                        Toast.error(data.status.description);
                    }

                });

                result.error(function (data) {
                    Toast.error( "An error occured, please try again!" + (data || ""));
                });

            };

            $scope.loadUsers();
        }]);
