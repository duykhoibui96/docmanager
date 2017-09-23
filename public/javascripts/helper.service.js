angular
    .module('helper', [])
    .service('loading', function ($timeout) {

        this.start = function () {

            angular.element('#loading').show();

        }

        this.stop = function () {

            $timeout(function () {

                angular.element('#loading').hide();

            }, 500);


        }


    })
    .service('auth', function ($localStorage) {

        this.isAuthenticated = function () {

            return $localStorage.auth;

        }

        this.getUsername = function () {

            if ($localStorage.auth)
                return $localStorage.auth.username;
            return null;

        }

    })
    .directive('loading', function () {

        return {

            restrict: 'EA',
            templateUrl: '/views/components/loading.component.html'

        }

    })
    .directive('compareTo', function () {
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
    });