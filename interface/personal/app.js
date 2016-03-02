/***
 Metronic AngularJS App Main Script
 ***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "Commons",
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    'ui.bootstrap',
    'daterangepicker',
    'uiGmapgoogle-maps',
    'angularFileUpload'
]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);


//MetronicApp.config(['$httpProvider', function ($httpProvider) {
//        $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
//                return {
//                    'request': function (config) {
//                        config.headers = config.headers || {};
//                        if ($localStorage.token) {
//                            config.headers.Authorization = 'Bearer ' + $localStorage.token;
//                        }
//                        return config;
//                    },
//                    'responseError': function (response) {
//                        if (response.status === 401 || response.status === 403) {
//                            $location.path('/login.html');
//                        }
//                        return $q.reject(response);
//                    }
//                };
//            }]);
//    }]);


/********************************************
 BEGIN: BREAKING CHANGE in AngularJS v1.3.x:
 *********************************************/
/**
 `$controller` will no longer look for controllers on `window`.
 The old behavior of looking on `window` for controllers was originally intended
 for use in examples, demos, and toy apps. We found that allowing global controller
 functions encouraged poor practices, so we resolved to disable this behavior by
 default.

 To migrate, register your controllers with modules rather than exposing them
 as globals:

 Before:

 ```javascript
 function MyController() {
 // ...
 }
 ```

 After:

 ```javascript
 angular.module('myApp', []).controller('MyController', [function() {
 // ...
 }]);

 Although it's not recommended, you can re-enable the old behavior like this:

 ```javascript
 angular.module('myModule').config(['$controllerProvider', function($controllerProvider) {
 // this option might be handy for migrating old apps, but please don't use it
 // in new ones!
 $controllerProvider.allowGlobals();
 }]);
 **/

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function ($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
 *********************************************/

/*
 * CONFIGURE HTTP INTERCEPTOR
 */

MetronicApp.config([
    "$httpProvider", "$stateProvider",
    function ($httpProvider, $stateProvider) {
        $httpProvider.interceptors.push(function ($rootScope, Loader, LocalStorage, Toast) {
            var isRestContext = function (url) {
                return url.indexOf("/rest/") > 0;
            };

            return {
                request: function (config) {
                    if (isRestContext(config.url)) {
                        Loader.start();
                        var token = $rootScope.userInfo.sessionId;
                        if (token) {
                            config.headers[Constants.KEY_SESSION_ID] = token;
                        }
                    }
                    return config;
                },
                response: function (response) {
                    if (isRestContext(response.config.url)) {
                        Loader.stop();

                        if (!response.data.status) {
                            if (!(response.headers('Content-Type') == "application/octet-stream")) {
                                Toast.error("An error occurred", "We were unable to open discussions with "
                                + "our servers. Please try again");
                            }
                        } else if (response.data.status.code > 0) {
                            // Not success, apparently. Toast the message
                            Toast.info("Something happened", response.data.status.description);
                        }

                        if (response.data.status && response.data.status.code === 211) {
                            // Unauthenticated!!!
                            LocalStorage.resetImmediate();
                            location.href = "../login.html";
                        }
                    }
                    return response;
                },
                responseError: function (response) {
                    if (isRestContext(response.config.url)) {
                        Loader.stop();
                        Toast.error("An error occurred", "We were unable to open discussions"
                        + " with our servers.  Your internet connection might be down");
                    }
                    return response;
                }
            };
        });
    }
]);


/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function ($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        layoutImgPath: Metronic.getAssetsPath() + 'img/',
        layoutCssPath: Metronic.getAssetsPath() + 'css/'
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', 'API', 'LocalStorage', '$location', '$http',
    function ($scope, API, LocalStorage, $location, $http) {
        $scope.$on('$viewContentLoaded', function () {
            Metronic.initComponents(); // init core components
            //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive

        });

        $scope.logout = function () {
            API.logout().
                success(function (data, status, headers, config) {
                    if (data.status.code === 0) {
                        LocalStorage.resetImmediate();
                        location.href = '../';
                    }
                }).
                error(function (data, status, headers, config) {
                    console.log(data);
                });

        };

    }]);

/***
 Layout Partials.
 By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial
 initialization can be disabled and Layout.init() should be called on page load complete as explained above.
 ***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initHeader(); // init header
    });
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initSidebar(); // init sidebar
    });
}]);

/* Setup Layout Part - Theme Panel */
MetronicApp.controller('ThemePanelController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/dashboard");

    $stateProvider

        // Dashboard
        .state('dashboard', {
            url: "/dashboard",
            templateUrl: "../assets/views/dashboard.html",
            data: {pageTitle: 'Admin Dashboard'},
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/css/morris.css',
                            '../assets/css/tasks.css',
                            '../assets/lib/morris.min.js',
                            '../assets/lib/raphael-min.js',
                            '../assets/lib/jquery.sparkline.min.js',
                            '../assets/lib/index3.js',
                            '../assets/lib/tasks.js',
                            '../assets/js/controllers/DashboardController.js'
                        ]
                    });
                }]
            }
        })

        // AngularJS plugins
        .state('fileupload', {
            url: "/file_upload",
            templateUrl: "../assets/views/file_upload.html",
            data: {pageTitle: 'AngularJS File Upload'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'angularFileUpload',
                        files: [
                            '../assets/lib/angular-file-upload.min.js',
                        ]
                    }, {
                        name: 'MetronicApp',
                        files: [
                            '../assets/js/controllers/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // UI Select
        .state('uiselect', {
            url: "/ui_select",
            templateUrl: "../assets/views/ui_select.html",
            data: {pageTitle: 'AngularJS Ui Select'},
            controller: "UISelectController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'ui.select',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/lib/select.min.css',
                            '../assets/lib/ui-select/select.min.js'
                        ]
                    }, {
                        name: 'MetronicApp',
                        files: [
                            '../assets/js/controllers/UISelectController.js'
                        ]
                    }]);
                }]
            }
        })

        // UI Bootstrap
        .state('map', {
            url: "/map",
            templateUrl: "../assets/views/map.html",
            data: {pageTitle: 'GIS Map', noblur: true},
            controller: "MapController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            '../assets/js/controllers/MapController.js'
                        ]
                    }]);
                }]
            }
        })

        // Agent Report
        .state('agentreport', {
            url: "/agentreport",
            templateUrl: "../assets/views/agentreport.html",
            data: {pageTitle: 'Agent Report'},
            controller: "AgentReportController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            '../assets/css/clockface.css',
                            '../assets/css/datepicker3.css',
                            '../assets/css/bootstrap-timepicker.min.css',
                            '../assets/css/colorpicker.css',
                            '../assets/css/daterangepicker-bs3.css',
                            '../assets/css/bootstrap-datetimepicker.min.css',
                            '../assets/lib/bootstrap-datepicker.js',
                            '../assets/lib/bootstrap-timepicker.min.js',
                            '../assets/lib/clockface.js',
                            '../assets/lib/moment.min.js',
                            '../assets/lib/daterangepicker.js',
                            '../assets/lib/bootstrap-colorpicker.js',
                            '../assets/lib/bootstrap-datetimepicker.min.js',
                            '../assets/lib/components-pickers.js',
                            '../assets/js/controllers/AgentReportController.js'
                        ]
                    }]);
                }]
            }
        })


        // Transformer
        .state('transformers', {
            url: "/transformers",
            templateUrl: "../assets/views/entities.html",
            data: {pageTitle: 'Transformers', entity: "Transformer"},
            controller: "EntityController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            '../assets/css/datepicker3.css',
                            '../assets/css/select2.css',
                            '../assets/css/todo.css',
                            '../assets/lib/bootstrap-datepicker.js',
                            '../assets/lib/select2.min.js',
                            '../assets/lib/todo.js',
                            '../assets/js/controllers/EntityController.js'
                        ]
                    }]);
                }]
            }
        })

        // Transformer Detail
        .state("transformers.detail", {
            url: "",
            templateUrl: "../assets/views/entities/transformer.html"
        })

        // Transformer update
        .state("transformers.update", {
            url: "",
            templateUrl: "../assets/views/entities/transformer.html"
        })

        .state("transformer", {
            url: "/transformer/{pacdCode:[0-9]+}",
            abstract: true,
            templateUrl: "../assets/views/entity.html",
            data: {entity: 'Transformer'},
            controller: "EntityController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            '../assets/css/datepicker3.css',
                            '../assets/css/select2.css',
                            '../assets/css/todo.css',
                            '../assets/lib/bootstrap-datepicker.js',
                            '../assets/lib/select2.min.js',
                            '../assets/lib/todo.js',
                            '../assets/js/controllers/EntityController.js'
                        ]
                    }]);
                }]
            }
        })
        .state("transformer.detail", {
            url: "",
            templateUrl: "../assets/views/entities/transformer.html"
        })
        // Transformer update
        .state("transformer.update", {
            url: "",
            templateUrl: "../assets/views/entities/transformer.html"
        })

        // Substation
        .state('substations', {
            url: "/substations",
            templateUrl: "../assets/views/entities.html",
            data: {pageTitle: 'Substations', entity: "Substation"},
            controller: "EntityController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            '../assets/css/datepicker3.css',
                            '../assets/css/select2.css',
                            '../assets/css/todo.css',
                            '../assets/lib/bootstrap-datepicker.js',
                            '../assets/lib/select2.min.js',
                            '../assets/lib/todo.js',
                            '../assets/js/controllers/EntityController.js'
                        ]
                    }]);
                }]
            }
        })

        // Substation Detail
        .state("substations.detail", {
            url: "",
            templateUrl: "../assets/views/entities/substation.html"
        })

        // Substation update
        .state("substations.update", {
            url: "",
            templateUrl: "../assets/views/entities/substation.html"
        })

        .state("substation", {
            url: "/substation/{pacdCode:[0-9]+}",
            abstract: true,
            templateUrl: "../assets/views/entity.html",
            data: {entity: 'Substation'},
            controller: "EntityController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            '../assets/css/datepicker3.css',
                            '../assets/css/select2.css',
                            '../assets/css/todo.css',
                            '../assets/lib/bootstrap-datepicker.js',
                            '../assets/lib/select2.min.js',
                            '../assets/lib/todo.js',
                            '../assets/js/controllers/EntityController.js'
                        ]
                    }]);
                }]
            }
        })
        .state("substation.detail", {
            url: "",
            templateUrl: "../assets/views/entities/substation.html"
        })
        // Substation update
        .state("substation.update", {
            url: "",
            templateUrl: "../assets/views/entities/substation.html"
        })


        // Poles
        .state('poles', {
            url: "/poles",
            templateUrl: "../assets/views/entities.html",
            data: {pageTitle: 'Poles', entity: "Pole"},
            controller: "EntityController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            '../assets/css/datepicker3.css',
                            '../assets/css/select2.css',
                            '../assets/css/todo.css',
                            '../assets/lib/bootstrap-datepicker.js',
                            '../assets/lib/select2.min.js',
                            '../assets/lib/todo.js',
                            '../assets/js/controllers/EntityController.js'
                        ]
                    }]);
                }]
            }
        })

        // Pole Detail
        .state("poles.detail", {
            url: "",
            templateUrl: "../assets/views/entities/pole.html"
        })

        // Pole update
        .state("poles.update", {
            url: "",
            templateUrl: "../assets/views/entities/pole.html"
        })

        .state("pole", {
            url: "/pole/{pacdCode:[0-9]+}",
            abstract: true,
            templateUrl: "../assets/views/entity.html",
            data: {entity: 'Pole'},
            controller: "EntityController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            '../assets/css/datepicker3.css',
                            '../assets/css/select2.css',
                            '../assets/css/todo.css',
                            '../assets/lib/bootstrap-datepicker.js',
                            '../assets/lib/select2.min.js',
                            '../assets/lib/todo.js',
                            '../assets/js/controllers/EntityController.js'
                        ]
                    }]);
                }]
            }
        })
        .state("pole.detail", {
            url: "",
            templateUrl: "../assets/views/entities/pole.html"
        })
        // Pole update
        .state("pole.update", {
            url: "",
            templateUrl: "../assets/views/entities/pole.html"
        })


        // Building
        .state('buildings', {
            url: "/buildings",
            templateUrl: "../assets/views/entities.html",
            data: {pageTitle: 'Buildings', entity: "Building"},
            controller: "EntityController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            '../assets/css/datepicker3.css',
                            '../assets/css/select2.css',
                            '../assets/css/todo.css',
                            '../assets/lib/bootstrap-datepicker.js',
                            '../assets/lib/select2.min.js',
                            '../assets/lib/todo.js',
                            '../assets/js/controllers/EntityController.js'
                        ]
                    }]);
                }]
            }
        })

        // Building Detail
        .state("buildings.detail", {
            url: "",
            templateUrl: "../assets/views/entities/building.html"
        })

        // Building update
        .state("buildings.update", {
            url: "",
            templateUrl: "../assets/views/entities/building.html"
        })

        .state("building", {
            url: "/building/{pacdCode:[0-9]+}",
            abstract: true,
            templateUrl: "../assets/views/entity.html",
            data: {entity: 'Building'},
            controller: "EntityController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            '../assets/css/datepicker3.css',
                            '../assets/css/select2.css',
                            '../assets/css/todo.css',
                            '../assets/lib/bootstrap-datepicker.js',
                            '../assets/lib/select2.min.js',
                            '../assets/lib/todo.js',
                            '../assets/js/controllers/EntityController.js'
                        ]
                    }]);
                }]
            }
        })
        .state("building.detail", {
            url: "",
            templateUrl: "../assets/views/entities/building.html"
        })
        // Building update
        .state("building.update", {
            url: "",
            templateUrl: "../assets/views/entities/building.html"
        })

        // Route Plan
        .state('routeplan', {
            url: "/routeplan",
            templateUrl: "../assets/views/routeplan.html",
            data: {pageTitle: 'Route Plan'},
            controller: "RoutePlanController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            '../assets/js/controllers/RoutePlanController.js'
                        ]
                    }]);
                }]
            }
        })

        // Customer
        .state('customers', {
            url: "/customers",
            templateUrl: "../assets/views/entities.html",
            data: {pageTitle: 'Customers', entity: "Customer"},
            controller: "EntityController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            '../assets/css/datepicker3.css',
                            '../assets/css/select2.css',
                            '../assets/css/todo.css',
                            '../assets/lib/bootstrap-datepicker.js',
                            '../assets/lib/select2.min.js',
                            '../assets/lib/todo.js',
                            '../assets/js/controllers/EntityController.js'
                        ]
                    }]);
                }]
            }
        })

        // Customer Detail
        .state("customers.detail", {
            url: "",
            templateUrl: "../assets/views/entities/customer.html"
        })

        // Customer update
        .state("customers.update", {
            url: "",
            templateUrl: "../assets/views/entities/customer.html"
        })

        .state("customer", {
            url: "/customer/{pacdCode:[0-9]+}",
            abstract: true,
            templateUrl: "../assets/views/entity.html",
            data: {entity: 'Customer'},
            controller: "EntityController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            '../assets/css/datepicker3.css',
                            '../assets/css/select2.css',
                            '../assets/css/todo.css',
                            '../assets/lib/bootstrap-datepicker.js',
                            '../assets/lib/select2.min.js',
                            '../assets/lib/todo.js',
                            '../assets/js/controllers/EntityController.js'
                        ]
                    }]);
                }]
            }
        })
        .state("customer.detail", {
            url: "",
            templateUrl: "../assets/views/entities/customer.html"
        })
        // Customer update
        .state("customer.update", {
            url: "",
            templateUrl: "../assets/views/entities/customer.html"
        })



        // Customer Report
        .state('customerreport', {
            url: "/customerreport",
            templateUrl: "../assets/views/customerreport.html",
            data: {pageTitle: 'Customer Enumeration Report'},
            controller: "CustomerReportController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            '../assets/js/controllers/CustomerReportController.js',
                            '../assets/css/clockface.css',
                            '../assets/css/datepicker3.css',
                            '../assets/css/bootstrap-timepicker.min.css',
                            '../assets/css/colorpicker.css',
                            '../assets/css/daterangepicker-bs3.css',
                            '../assets/css/bootstrap-datetimepicker.min.css',
                            '../assets/lib/bootstrap-datepicker.js',
                            '../assets/lib/bootstrap-timepicker.min.js',
                            '../assets/lib/clockface.js',
                            '../assets/lib/moment.min.js',
                            '../assets/lib/daterangepicker.js',
                            '../assets/lib/bootstrap-colorpicker.js',
                            '../assets/lib/bootstrap-datetimepicker.min.js',
                            '../assets/lib/components-pickers.js'
                        ]
                    }]);
                }]
            }
        })

        //Substation Stats
        .state('substats', {
            url: "/substats",
            templateUrl: "../assets/views/substats.html",
            data: {pageTitle: 'Substation Stats'},
            controller: "SubstationStatController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            '../assets/js/controllers/SubstationStatController.js',
                            '../assets/css/clockface.css',
                            '../assets/css/datepicker3.css',
                            '../assets/css/bootstrap-timepicker.min.css',
                            '../assets/css/colorpicker.css',
                            '../assets/css/daterangepicker-bs3.css',
                            '../assets/css/bootstrap-datetimepicker.min.css',
                            '../assets/lib/bootstrap-datepicker.js',
                            '../assets/lib/bootstrap-timepicker.min.js',
                            '../assets/lib/clockface.js',
                            '../assets/lib/moment.min.js',
                            '../assets/lib/daterangepicker.js',
                            '../assets/lib/bootstrap-colorpicker.js',
                            '../assets/lib/bootstrap-datetimepicker.min.js',
                            '../assets/lib/components-pickers.js'
                        ]
                    }]);
                }]
            }
        })

        // User Profile
        .state("profile", {
            abstract: true,
            url: "/profile",
            templateUrl: "../assets/views/profile.html",
            data: {pageTitle: 'My Account'},
            controller: "ProfileController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/css/bootstrap-fileinput.css',
                            '../assets/css/profile.css',
                            '../assets/css/tasks.css',
                            '../assets/lib/jquery.sparkline.min.js',
                            '../assets/lib/bootstrap-fileinput.js',
                            '../assets/lib/profile.js',
                            '../assets/js/controllers/ProfileController.js' //Seems to be the only needed one for now
                        ]
                    });
                }]
            }
        })

        // User Profile Dashboard
        .state("profile.dashboard", {
            url: "",
            templateUrl: "../assets/views/profile/dashboard.html"
        })

        // User Profile Account
        .state("profile.settings", {
            url: "/settings",
            templateUrl: "../assets/views/profile/account.html",
            data: {pageTitle: 'Account Settings'}
        })

        // User Profile Help
        .state("profile.help", {
            url: "/help",
            templateUrl: "../assets/views/profile/help.html",
            data: {pageTitle: 'User Help'}
        })

        // Agents
        .state('accounts', {
            url: "/accounts",
            templateUrl: "../assets/views/accounts.html",
            data: {pageTitle: 'Manage Accounts'},
            controller: "AccountsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            '../assets/js/controllers/AccountsController.js',
                            '../assets/css/bootstrap-fileinput.css',
                            '../assets/css/profile.css',
                            '../assets/css/tasks.css',
                            '../assets/lib/jquery.sparkline.min.js',
                            '../assets/lib/bootstrap-fileinput.js',
                            '../assets/lib/profile.js',
                            '../assets/css/clockface.css',
                            '../assets/css/datepicker3.css',
                            '../assets/css/bootstrap-timepicker.min.css',
                            '../assets/css/colorpicker.css',
                            '../assets/css/daterangepicker-bs3.css',
                            '../assets/css/bootstrap-datetimepicker.min.css',
                            '../assets/lib/bootstrap-datepicker.js',
                            '../assets/lib/bootstrap-timepicker.min.js',
                            '../assets/lib/clockface.js',
                            '../assets/lib/moment.min.js',
                            '../assets/lib/daterangepicker.js',
                            '../assets/lib/bootstrap-colorpicker.js',
                            '../assets/lib/bootstrap-datetimepicker.min.js',
                            '../assets/lib/components-pickers.js'
                        ]
                    }]);
                }]
            }
        })

        // Acounts Detail
        .state("accounts.detail", {
            url: "",
            templateUrl: "../assets/views/profile/accountdetail.html"
        })

        // Create Account
        .state('createaccount', {
            url: "/createaccount",
            templateUrl: "../assets/views/createaccount.html",
            data: {pageTitle: 'Create Account'},
            controller: "CreateAccountController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            '../assets/js/controllers/CreateAccountController.js',
                            '../assets/lib/angular-file-upload.min.js',
                            '../assets/css/datepicker3.css',
                            '../assets/css/bootstrap-datetimepicker.min.css',
                            '../assets/lib/bootstrap-datepicker.js',
                            '../assets/lib/moment.min.js',
                            '../assets/lib/bootstrap-datetimepicker.min.js',
                            '../assets/css/bootstrap-fileinput.css',
                            '../assets/css/profile.css',
                            '../assets/lib/bootstrap-fileinput.js',
                            '../assets/lib/profile.js',
                            '../assets/lib/bootstrap-datepicker.js',
                        ]
                    }]);
                }]
            }
        })


        // Incidences
        .state('incidences', {
            url: "/incidences",
            templateUrl: "../assets/views/incidences.html",
            data: {pageTitle: 'Incidences', entity: "IncidenceReport"},
            controller: "EntityController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/css/bootstrap-fileinput.css',
                            '../assets/css/bootstrap-switch.min.css',
                            '../assets/css/jquery.tagsinput.css',
                            '../assets/css/bootstrap-markdown.min.css',
                            '../assets/css/typeahead.css',
                            '../assets/lib/spinner.min.js',
                            '../assets/lib/bootstrap-fileinput.js',
                            '../assets/lib/bootstrap-switch.min.js',
                            '../assets/lib/jquery.tagsinput.min.js',
                            '../assets/lib/bootstrap-maxlength.min.js',
                            '../assets/lib/bootstrap.touchspin.js',
                            '../assets/lib/handlebars.min.js',
                            '../assets/lib/components-form-tools.js',
                            '../assets/js/controllers/EntityController.js'
                        ]
                    }]);
                }]
            }
        })

        // Incidence Detail
        .state("incidences.detail", {
            url: "",
            templateUrl: "../assets/views/entities/incidence.html"
        })
        // Incidence Update
        .state("incidences.update", {
            url: "",
            templateUrl: "../assets/views/entities/incidence.html"
        })


        // Activity
        .state('activity', {
            url: "/activities",
            templateUrl: "../assets/views/log.html",
            data: {pageTitle: 'Activity Log', entity: "Activity Log"},
            controller: "ActivityController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/css/bootstrap-fileinput.css',
                            '../assets/css/bootstrap-switch.min.css',
                            '../assets/css/jquery.tagsinput.css',
                            '../assets/css/bootstrap-markdown.min.css',
                            '../assets/css/typeahead.css',
                            '../assets/lib/spinner.min.js',
                            '../assets/lib/bootstrap-fileinput.js',
                            '../assets/lib/bootstrap-switch.min.js',
                            '../assets/lib/jquery.tagsinput.min.js',
                            '../assets/lib/bootstrap-maxlength.min.js',
                            '../assets/lib/bootstrap.touchspin.js',
                            '../assets/lib/handlebars.min.js',
                            '../assets/lib/components-form-tools.js',
                            '../assets/css/clockface.css',
                            '../assets/css/datepicker3.css',
                            '../assets/css/bootstrap-timepicker.min.css',
                            '../assets/css/colorpicker.css',
                            '../assets/css/daterangepicker-bs3.css',
                            '../assets/css/bootstrap-datetimepicker.min.css',
                            '../assets/lib/bootstrap-datepicker.js',
                            '../assets/lib/bootstrap-timepicker.min.js',
                            '../assets/lib/clockface.js',
                            '../assets/lib/moment.min.js',
                            '../assets/lib/daterangepicker.js',
                            '../assets/lib/bootstrap-colorpicker.js',
                            '../assets/lib/bootstrap-datetimepicker.min.js',
                            '../assets/lib/components-pickers.js',
                            '../assets/js/controllers/ActivityController.js'
                        ]
                    }]);
                }]
            }
        })

        // Activity Detail
        .state("activity.detail", {
            url: "",
            templateUrl: "../assets/views/logdetail.html"
        })





}]);

/* Init global settings and run the app */
MetronicApp.run([
    "$rootScope", "settings", "$state", "LocalStorage", "API", "Loader", "Functions",
    function ($rootScope, settings, $state, LocalStorage, API, Loader, Functions) {
        var initializeUser = function () {
            var userInfo = LocalStorage.get(Constants.KEY_USER_INFO) || {};

            // Inject absolute profile image URL
            var imageUrl = API.getImageUrl(userInfo.imageUrl) || "../assets/img/avatar.png";
            userInfo.imageUrlAbsolute = imageUrl;

            // Inject user into global space
            $rootScope.userInfo = userInfo;
        };

        var verifyAuth = function () {
            var roles = ["ADMIN", "CLIENT"];
            if (roles.indexOf($rootScope.userInfo.role) < 0) {
                location.href = '/login.html';
                return false;
            }
            return true;
        };

        var injectGlobals = function () {
            // Inject state to be accessed from view
            $rootScope.$state = $state;

            // Inject loader service
            $rootScope.$loader = Loader;

            // Inject Functions service to propagate utility functions to the view
            $rootScope.$functions = Functions;
        };

        var init = function () {
            initializeUser();
            if (verifyAuth()) {
                injectGlobals();
            }
        };

        init();

    }]);
