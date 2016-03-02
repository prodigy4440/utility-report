/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var Commons = angular.module("Commons", ['ngStorage']);

// Services

Commons.service("LocalStorage", ["$localStorage", function ($localStorage) {
    var self = this;

    self.get = function (key) {
        return $localStorage[key];
    };

    self.put = function (key, value) {
        $localStorage[key] = value;
    };

    self.putImmediate = function (key, value) {
        self.put(key, value);
        self.flush();
    };

    self.remove = function (key) {
        var val = $localStorage[key];
        delete $localStorage[key];
        return val;
    };

    self.removeImmediate = function (key) {
        var val = self.remove(key);
        self.flush();
        return val;
    };

    self.flush = function () {
        $localStorage.$save();
    };

    self.reset = function () {
        $localStorage.$reset();
    };

    self.resetImmediate = function () {
        self.reset();
        self.flush();
    };
}
]);

Commons.service("API", ["$http", function ($http) {
    var self = this;

    self.login = function (credentials) {
        return $http.post(Constants.BASE_URL +Constants.ACCOUNT+ 'login', credentials);
    };

    self.logout = function (token) {
        return $http.get(Constants.BASE_URL +Constants.ACCOUNT+ 'logout',{headers: {'sessionId': token}});
    };
    
    self.createSuperUser = function(){
            return $http.post(Constants.BASE_URL+Constants.ACCOUNT+'create');
    };
    
    self.createOtherUser = function(){
            return $http.post(Constants.BASE_URL+Constants.ACCOUNT+'create/other');
    };

    self.getUsers = function(token){
        return $http.get(Constants.BASE_URL+Constants.ACCOUNT+'users',{headers:{'sessionId':token}});
    };
    
    self.getProfile = function(){
            return $http.get(Constants.BASE_URL+Constants.ACCOUNT+'profile/detail');
    };
    
    self.getLoginLog = function(){
            return $http.get(Constants.BASE_URL+Constants.ACCOUNT+'login/log');
    };
    
    self.getLoginLogs = function(){
            return $http.get(Constants.BASE_URL+Constants.ACCOUNT+'login/logs');
    };
    
    self.changePassword = function(){
            return $http.put(Constants.BASE_URL+Constants.ACCOUNT+'changepassword');
    };
    
    self.mailConfig = function(){
            return $http.post(Constants.BASE_URL+Constants.ACCOUNT+'mailconfig');
    };
    
    self.forgetPassword = function(useremail){
            return $http.get(Constants.BASE_URL+Constants.ACCOUNT+"forget",{params: { email: useremail}});
    };
    
    self.resetPassword = function(){
            return $http.put(Constants.BASE_URL+Constants.ACCOUNT+"reset");
    };
    
    self.getBusinessUnits = function(){
            return $http.get(Constants.BASE_URL+Constants.PUBLIC+"businessunits");
    };
    
    self.getBusinessUnits = function(){
            return $http.get(Constants.BASE_URL+Constants.PUBLIC+"cashoffices/all");
    };
    

//    self.getImageUrl = function (relativeUrl) {
//        if (!relativeUrl) {
//            return null;
//        }
//        return Constants.BASE_URL + relativeUrl;
//    };
//
//    self.updateProfile = function (payload) {
//        return $http.put(Constants.BASE_URL + "/rest/account", payload);
//    }
//
//    self.updatePassword = function (passInfo) {
//        return $http.put(Constants.BASE_URL + "/rest/account/updatePassword", passInfo);
//    }
//
//    self.fetchEntities = function (entity, cursor, newer) {
//        var direction = newer ? "ASC" : "DESC";
////      return $http.get(Constants.BASE_URL + "/rest/entity/" + entity + "/date/2015-01-01 00:00:00 +0100/2015-06-01 00:00:00 +0100");
//        return $http.get(Constants.BASE_URL + "/rest/entity/" + entity + "/" + cursor + "/" + direction);
//    };
//
//    self.fetchEntity = function (pacdCode) {
//        return $http.get(Constants.BASE_URL + "/rest/entity/pacd/" + pacdCode);
//    };
//
//    self.fetchIncidenceReport = function(id){
//        return $http.get(Constants.BASE_URL + "/rest/entity/IncidenceReport/"+id);
//    }
//
//
//    self.updateEntity = function (entity, payload) {
//        return $http.put(Constants.BASE_URL + "/rest/entity/" + entity, payload);
//    };
//
//    self.deleteEntity = function (entity, id) {
//        return $http.delete(Constants.BASE_URL + '/rest/entity/' + entity + '/' + id);
//    }
//
//    self.fetchAccounts = function () {
//        return $http.get(Constants.BASE_URL + "/rest/account");
//    };
//
//    self.createAccount = function (accountInfo) {
//        return $http.post(Constants.BASE_URL + "/rest/account", accountInfo);
//    }
//
//    self.deleteAccount = function (userInfo) {
//        return $http.delete(Constants.BASE_URL + '/rest/account/' + userInfo['id']);
//    }
//
//    self.fetchMapData = function (config) {
//        return $http.post(Constants.BASE_URL + "/rest/entity/map", config);
//    };
//
//    self.fetchReports = function (start, end) {
//        return $http.get(Constants.BASE_URL + '/rest/admin/report/' + encodeURIComponent(start) + '/' + encodeURIComponent(end));
//    };
//
//    self.preFetchReports = function (type) {
//        return $http.get(Constants.BASE_URL + "/rest/admin/report/"+ type + "/1234567890/DESC");
//    };
//
//    self.loadStats = function(){
//        return $http.get(Constants.BASE_URL+ "/rest/admin/stats");
//    };
//
//    self.fetchActionLog = function(role, cursor, direction){
//        return $http.get(Constants.BASE_URL+ '/rest/admin/action-log/' + role + '/' + cursor + '/' + direction);
//    };
//
//    self.fetchActionLogByDate = function(start, end){
//        return $http.get(Constants.BASE_URL+ '/rest/admin/action-log/' + encodeURIComponent(start) + '/' + encodeURIComponent(end));
//    };
//
//    self.fetchRoutePlan = function(bookNumber, type){
//        return $http.get(Constants.BASE_URL + '/rest/admin/route-plan/'+type+'/'+ encodeURIComponent(bookNumber) +'/download');
//    };
//
//    self.downloadAgentReport = function(url){
//        var config = {'headers' : {'Accept' : 'application/octet-stream'}};
//        return $http.get(url, config);
//    };
//
//    self.downloadCustomerReport = function(url){
//        var config = {'headers' : {'Accept' : 'application/octet-stream'}};
//        return $http.get(url, config);
//    };
//
//    self.getActionLogSummary = function(startDate, endDate){
//        return $http.get(Constants.BASE_URL + '/rest/admin/action-log-summary/'+encodeURIComponent(startDate)+'/'+encodeURIComponent(endDate));
//    };
//
//    self.getUserById = function(id){
//        return $http.get(Constants.BASE_URL+"/rest/account/"+id);
//    };
//
//    self.fetchSubstationStats = function(){
//        return $http.get(Constants.BASE_URL + '/rest/admin/substation-stats');
//    };

    ////In joke
    //self.fetchAgentContributions = function(){
    //    return $http.get(Constants.BASE_URL + '/rest/admin/agent-contribution');
    //}

}
]);

Commons.service("Loader", [function () {
    var self = this;
    var loading = false;

    self.start = function () {
        loading = true;
    };

    self.stop = function () {
        loading = false;
    };

    self.isLoading = function () {
        return loading;
    };
}]);

Commons.service("Toast", [function () {
    toastr.options = {
        debug: false,
        positionClass: "toast-top-right",
        showDuration: "1000",
        hideDuration: "1000",
        timeOut: "3000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    };

    var self = this;

    self.success = function (title, message) {
        toastr.success(message, title);
    };

    self.info = function (title, message) {
        toastr.info(message, title);
    };

    self.warning = function (title, message) {
        toastr.warning(message, title);
    }

    self.error = function (title, message) {
        toastr.error(message, title);
    };
}
]);

Commons.service("Functions", [
    function () {
        var self = this;
        self.parseDate = function (dateString) {
            var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
            if(isSafari){
                var newDate = dateString.split(' ');
                return new Date(newDate[0]).toDateString();
            }else {
                return new Date(dateString);
            }
        };

        self.getUserFullname = function (user) {
            return user.firstname + " " + user.lastname;
        };
    }
]);
