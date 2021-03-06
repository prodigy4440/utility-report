angular.module('MetronicApp').controller('UserProfileController',
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

        $scope.profile = {};

        $scope.fetchProfile = function () {
            var result = API.getProfile(entity.token);

            result.success(function (data) {
                if (data.status.code === 0) {
                    $scope.profile.firstname = data.entity.firstName;
                    $scope.profile.lastname = data.entity.lastName;
                    $scope.profile.username = data.entity.userName;
                    $scope.profile.phonenumber = data.entity.phoneNumber;
                    $scope.profile.email = data.entity.email;
                    $scope.profile.usertype = data.entity.userType;
                    $scope.profile.status = data.entity.status;

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
