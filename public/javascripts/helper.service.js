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
    .service('auth', function ($localStorage, $state) {

        this.isAuthenticated = function () {

            return $localStorage.auth;

        }

        this.getUsername = function () {

            if ($localStorage.auth)
                return $localStorage.auth.username;
            return null;

        }

        this.logout = function () {

            if ($localStorage.auth)
                delete $localStorage.auth;
            $state.transitionTo('login');

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
    })
    .filter('objLimitTo', function(){
        return function(obj, limit){
            var keys = Object.keys(obj);
            if(keys.length < 1) return [];
    
            var ret = new Object();
            var count = 0;
            angular.forEach(keys, function(key, arrayIndex){
                if (key !== '_id'){

                    if(count >= limit) return false;
                    ret[key] = obj[key];
                    count++;

                }       
            });
            return ret;
        };
    });