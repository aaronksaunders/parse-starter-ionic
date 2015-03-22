/**
 * beginnings of a controller to login to system
 * here for the purpose of showing how a service might
 * be used in an application
 */
angular.module('user.controllers', [])
    .controller('LoginController', [
        '$state', '$scope', 'UserService',   // <-- controller dependencies
        function ($state, $scope, UserService) {

            debugger;

            // ng-model holding values from view/html
            $scope.creds = {
                username: "adminuser",
                password: "password"
            };

            /**
             *
             */
            $scope.doLogoutAction = function () {
                UserService.logout()
                    .then(function (_response) {
                        if (_response.status) {
                            alert(_response.attributes.username);
                        } else {
                            alert("logout success " + _response);

                            // transition to next state
                            $state.go('app-login');

                        }
                    }, function (_error) {
                        alert("error logging in " + _error.debug);
                    })
            };

            /**
             *
             */
            $scope.doLoginAction = function () {
                UserService.login($scope.creds.username, $scope.creds.password)
                    .then(function (_response) {

                        alert("login success " + _response.attributes.username);

                        // transition to next state
                        $state.go('tab.list');

                    }, function (_error) {
                        alert("error logging in " + _error.message);
                    })
            };
        }]);
