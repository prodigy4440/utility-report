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

            $scope.loadUsers();

            $scope.user = {};
            $scope.user.options = ["ADMIN", "NORMAL", "OTHERS"];

            $scope.createUser = function () {
                var entity = LocalStorage.get(Constants.KEY_USER_INFO);

                $scope.config = {};
                $scope.config.headers = {};
                $scope.config.headers.sessionId = entity.token;
                $scope.config.params = {};
                $scope.config.params.username = $scope.user.username;
                $scope.config.params.password = $scope.user.password;
                $scope.config.params.email = $scope.user.email;
                $scope.config.params.phonenumber = $scope.user.phonenumber;
                $scope.config.params.firstname = $scope.user.firstname;
                $scope.config.params.lastname = $scope.user.lastname;
                $scope.config.params.usertype = $scope.user.usertype;

                var result = API.createOtherUser($scope.config);
                console.log(result);
                result.success(function (data) {
                    if (data.status.code === 0) {
                        Toast.success(data.status.description);
                        $window.location.reload();
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

            $scope.terminalagent = {};
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
                var tempbu = JSON.parse($scope.terminalagent.businessunit);
                var result = API.getBusinessUnitCashOffices(tempbu.name);
                result.success(function (data) {
                    console.log(data)
                    if (data.status.code === 0) {
                        $scope.cashoffices = data.entity;
                    }

                });
            };

            $scope.createTerminalAgent = function(){

                $scope.config = {};
                $scope.config.headers = {};
                $scope.config.headers.sessionId = entity.token;
                $scope.config.params = {};
                $scope.config.params.firstname = $scope.terminalagent.firstname;
                $scope.config.params.lastname = $scope.terminalagent.lastname;
                $scope.config.params.password = $scope.terminalagent.password;
                $scope.config.params.email = $scope.terminalagent.email;
                $scope.config.params.phonenumber = $scope.terminalagent.phonenumber;
                $scope.config.params.address1 = $scope.terminalagent.address1;
                $scope.config.params.address2 = $scope.terminalagent.address2;
                $scope.config.params.address3 = $scope.terminalagent.address3;
                $scope.config.params.city = $scope.terminalagent.city;
                $scope.config.params.coid = JSON.parse($scope.terminalagent.cashoffice).id;
                $scope.config.params.con = JSON.parse($scope.terminalagent.cashoffice).name;
                $scope.config.params.buid = JSON.parse($scope.terminalagent.businessunit).id;
                $scope.config.params.bun = JSON.parse($scope.terminalagent.businessunit).name;


                var result = API.createTerminalUser($scope.config);

                result.success(function (data) {
                    console.log(data);
                    if (data.status.code === 0) {
                        $window.location.reload();
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

            $scope.changeUserStatus = function(user){
                console.log(user);
                $scope.config = {};
                $scope.config.headers = {};
                $scope.config.headers.sessionId = entity.token;
                $scope.config.params = {};
                $scope.config.params.id = user.userId;


                var result = API.changeUserStatusAPI($scope.config);

                result.success(function (data) {
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


        }]);
