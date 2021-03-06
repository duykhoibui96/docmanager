angular
    .module('account', ['ui.router', 'ngStorage'])
    .config(function ($stateProvider) {

        $stateProvider
            .state('login', {

                url: '/login',
                templateUrl: '/views/account/login.html',
                controller: 'accountCtrl'


            })

    })
    .controller('accountCtrl', function ($scope, $state, $localStorage,$http) {

        $scope.signin = function () {

            $scope.error = undefined;
            if ($scope.isAuthenticating)
                return;
            $scope.isAuthenticating = true;
            $http.post('api/accounts/authentication', {

                Username: $scope.username,
                Password: $scope.password

            }).then(function (response) {

                $scope.isAuthenticating = false;
                var data = response.data;
                console.log(data);
                $localStorage.auth = {

                    username: data.Username,
                    EmplID: data.EmplID,
                    token: data.token,
                    permissions: data.permissions


                }
                console.log($localStorage.auth);
                $state.transitionTo('dashboard');


            }, function (err) {

                $scope.isAuthenticating = false;
                switch(err.status)
                {
                    case 406:
                        $scope.error = err.data;
                }


            })


        }



    });