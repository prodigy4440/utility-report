/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var LoginApp = angular.module('Login', ['Commons']);

LoginApp.run([
    "LocalStorage", function (LocalStorage) {
        var roles = ["ADMIN", "CLIENT"];
        var userInfo = LocalStorage.get(Constants.KEY_USER_INFO);
        if (userInfo && roles.indexOf(userInfo.role) >= 0) {
            //Already logged in, redirect to console
            location.href = "console/";
        }
    }
]);


LoginApp.controller('LoginController', ["$scope", "$window", "API","Toast", "LocalStorage",
    function ($scope, $window, API,Toast,LocalStorage) {
        
        var entity = LocalStorage.get(Constants.KEY_USER_INFO);

        if(entity != null){
            $window.location.href = "index.html";
        }
        
        $scope.flash = {};
        $scope.credentials = {};
        $scope.loader = {loading: false};

        $scope.login = function () {
            $scope.loader.loading = true;
            $scope.flash = {};

            var result = API.login($scope.credentials);

            result.success(function (data) {
                if (data.status.code === 0) {
                    LocalStorage.putImmediate(Constants.KEY_USER_INFO, data.entity);
                    Toast.success("Login successful");
                    $window.location.href = "index.html";
                } else{
                    Toast.error(data.status.description);
                }

                $scope.loader.loading = false;
            });

            result.error(function (data) {
                $scope.flash.message = "An error occured, please try again!" + (data || "");
                $scope.loader.loading = false;
            });
        };

    }
]);

LoginApp.controller('ForgetController', ["$scope", "$window","Toast", "API", 
    function ($scope, $window,Toast, API) {
        
        $scope.forget = function () {
            var result = API.forgetPassword($scope.email);
            result.success(function(data){
                if(data.status.code !== 200){
                    console.log(data.entity);
                }else{
                    $scope.message = data.status.description;
                }
            });
            
            result.error(function(data){
                Toast.warning("Connection Problem","Unable to connect to the server, please check your settings and continue.");
            });
        };

    }
]);