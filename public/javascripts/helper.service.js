angular
    .module('helper', [])
    .service('loading', function ($timeout) { //provide methods for show/hide loading process

        this.start = function () {

            angular.element('#loading').show();

        }

        this.stop = function () {

            $timeout(function () {

                angular.element('#loading').hide();

            }, 500);


        }


    })
    .service('auth', function ($localStorage, $state) { //for authentication

        this.isAuthenticated = function () {

            return $localStorage.auth;

        }



        this.getUsername = function () {

            if ($localStorage.auth)
                return $localStorage.auth.username;
            return null;

        }

        this.isPermitted = function (permissionName) {

            if (!$localStorage.auth || !$localStorage.auth.permissions)
                return false;

            return $localStorage.auth.permissions.find(function (item) {

                return item.includes(permissionName);

            });


        }

        this.logout = function () {

            if ($localStorage.auth)
                delete $localStorage.auth;
            $state.transitionTo('login');

        }

    })
    .directive('datePicker', function () {

        return {

            restrict: 'EA',
            link: function (scope, element) {

                $(function () {
                    $(`#${element[0].id}`).datepicker({
                        dateFormat: 'dd-mm-yy'
                    });
                });

            }

        }

    })
    .directive('loading', function () { //Showing loading process while transition happens between two states

        return {

            restrict: 'EA',
            templateUrl: '/views/components/loading.component.html'

        }

    })
    .directive('compareTo', function () { //For confirm password input textbox
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function (scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function (modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function () {
                    ngModel.$validate();
                });
            }
        };
    })
    .filter('objLimitTo', function () { //Limit numbers of element display in array by ng-repeat
        return function (obj, limit) {
            var keys = Object.keys(obj);
            if (keys.length < 1) return [];

            var ret = new Object();
            var count = 0;
            angular.forEach(keys, function (key, arrayIndex) {
                if (key !== '_id') {

                    if (count >= limit) return false;
                    ret[key] = obj[key];
                    count++;

                }
            });
            return ret;
        };
    });